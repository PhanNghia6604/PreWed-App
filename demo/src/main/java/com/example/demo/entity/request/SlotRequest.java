package com.example.demo.entity.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlotRequest {
    String startTime;//08:30
    String endTime;
    int duration;
}
