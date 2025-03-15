package com.example.demo.service;

import com.example.demo.config.properties.VnPayProperties;
import com.example.demo.entity.ServicePackage;
import com.example.demo.entity.request.PaymentRequest;
import com.example.demo.entity.request.PaymentResultRequest;
import com.example.demo.enums.BookingEnum;
import com.example.demo.integration.vnpay.VnPayUtils;
import com.example.demo.repository.BookingRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class PaymentService {

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    VnPayProperties properties;

    @Transactional
    public String createPaymentUrl(@NotNull PaymentRequest dto) {
        log.info("Payment Service [CREATE]: create payment url processing...");

        // get booking
        var booking = bookingRepository.findById(dto.getBookingId()).orElseThrow(() -> new RuntimeException("Booking not found"));

        double totalPrice = booking.getServices().stream()
                .map(ServicePackage::getPrice) // Lấy giá của từng dịch vụ
                .reduce(0f, Float::sum);

// init param values
        Map<String, String> vnpParamsMap = properties.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf((int)totalPrice * 100L));
        vnpParamsMap.put("vnp_OrderInfo", "Thanh toan booking cho expert");
        vnpParamsMap.put("vnp_IpAddr", "127.0.0.1");
        vnpParamsMap.replace("vnp_ReturnUrl", properties.getReturnUrl());

        //build query url
        String queryUrl = VnPayUtils.getPaymentURL(vnpParamsMap, true);
        String hashData = VnPayUtils.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VnPayUtils.hmacSHA512(properties.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        return properties.getUrl() + "?" + queryUrl;
    }

    @Transactional
    public void handlePaymentResponse(@NotNull PaymentResultRequest response) {
        log.info("Payment Service [UPDATE]: handle payment response processing...");

        // get booking
        var booking = bookingRepository.findById(response.getBookingId()).orElseThrow(() -> new RuntimeException("Booking not found"));

        log.info("Payment Service [UPDATE]: update order status");
        // case EXIST - update
        if (response.isSuccess()) {
            // case SUCCESS - update status to PROCESSING & minus item in store
            booking.setStatus(BookingEnum.AWAIT);

        } else {
            // case FAIL - update status to CANCELLED
            booking.setStatus(BookingEnum.CANCELLED);
        }

        bookingRepository.save(booking);
    }
}
