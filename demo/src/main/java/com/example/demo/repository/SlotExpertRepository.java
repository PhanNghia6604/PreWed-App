package com.example.demo.repository;

import com.example.demo.entity.SlotExpert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface SlotExpertRepository extends JpaRepository<SlotExpert, Long> {
    SlotExpert findBySlotIdAndExpertIdAndDate(Long slotId, Long expertId, LocalDate date);
}
