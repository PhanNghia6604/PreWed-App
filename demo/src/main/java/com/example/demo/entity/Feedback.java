package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    public double rating;
    public String comments;
    public LocalDateTime date;
    public boolean isDeleted = false;
    @ManyToOne
    @JoinColumn(name = "expert_id")
    Expert expert;
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
