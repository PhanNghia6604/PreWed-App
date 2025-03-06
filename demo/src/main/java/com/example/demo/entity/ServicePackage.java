package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Data
public class ServicePackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    @NotBlank(message = "Name cannot be blank")
    public String name;
    @NotBlank(message = "Description cannot be blank")
    public String description;
    @Min(value = 0, message = "Minimum price is 0")
    public float price;
    @NotBlank(message = "Expert Commission cannot be blank")
    public String expertCommission;
    public LocalDate transactionDate;
    public int duration;
    public boolean isAvailable = true;
    public boolean isDeleted = false;

    @ManyToMany(mappedBy = "services")
    @JsonIgnore
    List<Booking> bookings = new ArrayList<>();
}
