package com.example.demo.api;

import com.example.demo.entity.request.PaymentRequest;
import com.example.demo.entity.request.PaymentResultRequest;
import com.example.demo.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payment API", description = "Payment service")
public class PaymentAPI {

    @Autowired
    PaymentService paymentService;

    @Operation(summary = "Create payment request")
    @Secured("ROLE_CUSTOMER")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    ResponseEntity createPaymentRequest(@RequestBody final PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentUrl(request));
    }

    @Operation(summary = "Handle response request")
    @Secured("ROLE_CUSTOMER")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping("/response")
    ResponseEntity handleResponseRequest(@RequestBody final PaymentResultRequest response) {
        paymentService.handlePaymentResponse(response);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
