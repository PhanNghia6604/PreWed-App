package com.example.demo.entity;

import com.example.demo.enums.CategoryEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import com.example.demo.enums.RoleEnum;


import lombok.Getter;
import lombok.Setter;


import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@DiscriminatorValue("EXPERT")
public class Expert extends User {
    @ElementCollection(targetClass = CategoryEnum.class)
    @Enumerated(EnumType.STRING)
    private List<CategoryEnum> specialty;

    private String avatar;
    private boolean approved = false;

    @OneToMany(mappedBy = "expert", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Certificate> certificates;

    public Expert() {
        this.setRoleEnum(RoleEnum.EXPERT);
    }

    @OneToMany(mappedBy = "expert")
    @JsonIgnore
    List<Feedback> feedbacks = new ArrayList<>();
}