package com.example.demo.api;

import com.example.demo.entity.Slot;
import com.example.demo.entity.request.SlotRequest;
import com.example.demo.service.SlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/slots")
@SecurityRequirement(name = "api")
public class SlotAPI {
    @Autowired
    SlotService slotService;
    @PostMapping
    public ResponseEntity createSlot(@RequestBody SlotRequest slotRequest){
        List<Slot> slots = slotService.createSlot(slotRequest);
        return ResponseEntity.ok(slots);
    }
    @GetMapping
    public ResponseEntity getSlot(){
        List<Slot> slots = slotService.getSlot();
        return ResponseEntity.ok(slots);
    }
}
