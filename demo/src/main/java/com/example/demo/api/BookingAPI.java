package com.example.demo.api;

import com.example.demo.entity.Booking;
import com.example.demo.entity.request.BookingRequest;
import com.example.demo.enums.BookingEnum;
import com.example.demo.service.BookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/booking")
public class BookingAPI {
    @Autowired
    BookingService bookingService;

    @PostMapping
    @Secured("ROLE_CUSTOMER")
    public ResponseEntity createBooking(@RequestBody BookingRequest bookingRequest)  {
        Booking booking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    @Secured({"ROLE_CUSTOMER", "ROLE_EXPERT"})
    public ResponseEntity getBooking(){
        return ResponseEntity.ok(bookingService.getBooking());
    }

    @PatchMapping("{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity updateStatus(@RequestParam BookingEnum status, @PathVariable long id) {
        Booking booking = bookingService.updateStatus(status, id);
        return ResponseEntity.ok(booking);
    }
}
