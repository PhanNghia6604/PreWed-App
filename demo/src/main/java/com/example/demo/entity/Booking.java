package com.example.demo.entity;

import com.example.demo.enums.BookingEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "bookings")
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
    name = "booking_services",
    joinColumns = @JoinColumn(name = "booking_id"),
    inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    List<ServicePackage> services = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "slot_expert_id")
    SlotExpert slotExpert;


    @Enumerated(EnumType.STRING)
    BookingEnum status;

    LocalDateTime createAt;
}
