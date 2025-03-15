package com.example.demo.entity.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResultRequest {

    @NotNull
    Long bookingId;

    @NotNull
    boolean isSuccess;
}
