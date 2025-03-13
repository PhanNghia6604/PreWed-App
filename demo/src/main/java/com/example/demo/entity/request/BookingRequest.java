package com.example.demo.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    Long slotId;
    Long expertId;
    LocalDate bookingDate;
    List<Long> serviceIds;
}
