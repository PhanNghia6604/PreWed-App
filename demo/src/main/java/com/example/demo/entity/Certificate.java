package com.example.demo.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String certificateUrl;   // URL của chứng chỉ
    private String certificateName;  // Tên chứng chỉ

    @ManyToOne

    @JsonBackReference
    @JoinColumn(name = "expert_id")  // Liên kết với Expert qua khóa ngoại
    private Expert expert;  // Mối quan hệ Many-to-One với Expert

    // Constructors, getters, setters
    public Certificate() {}

    public Certificate(String certificateUrl, String certificateName, Expert expert) {
        this.certificateUrl = certificateUrl;
        this.certificateName = certificateName;
        this.expert = expert;
    }

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String certificateUrl) {
        this.certificateUrl = certificateUrl;
    }

    public String getCertificateName() {
        return certificateName;
    }

    public void setCertificateName(String certificateName) {
        this.certificateName = certificateName;
    }

    public Expert getExpert() {
        return expert;
    }

    public void setExpert(Expert expert) {
        this.expert = expert;
    }
}