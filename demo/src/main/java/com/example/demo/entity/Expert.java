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
@DiscriminatorValue("EXPERT") // Xác định loại user là Expert
public class Expert extends User {
    @ElementCollection(targetClass = CategoryEnum.class)
    @Enumerated(EnumType.STRING)
    private List<CategoryEnum> specialty; // Lưu danh sách chuyên môn
    private String avatar;
    private boolean approved = false;

    @OneToMany(mappedBy = "expert", cascade = CascadeType.ALL)  // Thiết lập mối quan hệ One-to-Many với Certificate
    @JsonManagedReference
    private List<Certificate> certificates; // Liên kết với nhiều chứng chỉ



    public Expert() {
        this.setRoleEnum(RoleEnum.EXPERT); // Mặc định role là EXPERT
    }
    @OneToMany(mappedBy = "expert")
    @JsonIgnore
    List<Feedback> feedbacks = new ArrayList<>();

}
