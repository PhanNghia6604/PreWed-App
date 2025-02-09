package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    @NotBlank(message = "Name cannot be blank")
    public String Name;
    @NotBlank(message = "Password cannot be blank")
    public String Password;
    @NotBlank(message = "Phone cannot be blank")
    public String Phone;
    @NotBlank(message = "Address cannot be blank")
    public String Address;
    @NotBlank(message = "Email cannot be blank")
    public String Email;
    public boolean isDeleted = false;
}
