package com.example.demo.service;

import com.example.demo.entity.Slot;
import com.example.demo.entity.request.SlotRequest;
import com.example.demo.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SlotService {
    @Autowired
    SlotRepository slotRepository;
    public List<Slot> createSlot(SlotRequest slotRequest) {
        LocalTime startTime =  LocalTime.parse(slotRequest.getStartTime());
        LocalTime endTime = LocalTime.parse(slotRequest.getEndTime());
        int duration = slotRequest.getDuration();
        // startTime<= endTime thì mới tiếp tục tạo slot

        List<Slot> slots = new ArrayList<>();
        while(startTime.plusMinutes(duration).isBefore(endTime) || startTime.plusMinutes(duration).equals(endTime)){
        LocalTime slotEndTime = startTime.plusMinutes(duration);
        Slot slot = new Slot();
        slot.setStartTime(startTime);
        slot.setEndTime(slotEndTime);
        slots.add(slot);
        startTime = slotEndTime;
        }
        return slotRepository.saveAll(slots);
    }

    public List<Slot> getSlot() {
        return slotRepository.findAll();
    }
}
