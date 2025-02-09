package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;


@Entity
@Data
public class ServicePackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    @NotBlank(message = "Name cannot be blank")
    public String Name;
    @NotBlank(message = "Description cannot be blank")
    public String Description;
    @Min(value = 0, message = "Minimum fee is 0")
    public int Fee;
    @NotBlank(message = "Expert Commission cannot be blank")
    public String ExpertCommission;
    public String PaymentMethod;
    public LocalDate TransactionDate;

    public boolean isDeleted = false;
}
