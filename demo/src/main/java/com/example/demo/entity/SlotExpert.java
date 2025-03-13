package com.example.demo.entity;

import com.example.demo.enums.SlotStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SlotExpert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Enumerated(EnumType.STRING)
    SlotStatus status;

    LocalDate date;
    @ManyToOne
    @JoinColumn(name = "slot_id")
    Slot slot;

    @ManyToOne
    @JoinColumn(name = "expert_id")
    User expert;

    @OneToMany(mappedBy = "slotExpert")
            @JsonIgnore
    List<Booking> bookings = new ArrayList<>();
}
