package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import com.example.demo.enums.RoleEnum;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@DiscriminatorValue("EXPERT") // Xác định loại user là Expert
public class Expert extends User {

    private String specialty;
    private String avatar;

    @ElementCollection
    @NotEmpty(message = "Certificates cannot be empty")
    private List<String> certificates; // Danh sách chứng chỉ


    public Expert() {
        this.setRoleEnum(RoleEnum.EXPERT); // Mặc định role là EXPERT
    }
}
