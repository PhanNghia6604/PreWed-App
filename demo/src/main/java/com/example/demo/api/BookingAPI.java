package com.example.demo.api;

import com.example.demo.entity.Booking;
import com.example.demo.entity.request.BookingRequest;
import com.example.demo.service.BookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/booking")
@SecurityRequirement(name = "api")
public class BookingAPI {
    @Autowired
    BookingService bookingService;

    @PostMapping
    public ResponseEntity createBooking(@RequestBody BookingRequest bookingRequest) throws Exception {
        Booking booking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(booking);
    }
    @GetMapping
    public ResponseEntity getBooking(){
        return ResponseEntity.ok(bookingService.getBooking());
    }
}
