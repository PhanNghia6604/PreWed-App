package com.example.demo.api;

import com.example.demo.entity.Slot;
import com.example.demo.entity.request.SlotRequest;
import com.example.demo.service.SlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/slots")
public class SlotAPI {

    @Autowired
    SlotService slotService;

    @PostMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity createSlot(@RequestBody SlotRequest slotRequest){
        List<Slot> slots = slotService.createSlot(slotRequest);
        return ResponseEntity.ok(slots);
    }

    @GetMapping
    @Secured({"ROLE_CUSTOMER", "ROLE_ADMIN"})
    public ResponseEntity getSlot(){
        List<Slot> slots = slotService.getSlot();
        return ResponseEntity.ok(slots);
    }
    @DeleteMapping("{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity deleteSlot(@PathVariable long id){
        Slot slot = slotService.deleteSlotById(id);
        return ResponseEntity.ok(slot);
    }
}
