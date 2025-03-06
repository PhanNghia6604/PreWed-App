package com.example.demo.service;

import com.example.demo.entity.Expert;
import com.example.demo.entity.User;
import com.example.demo.entity.request.ExpertRequest;
import com.example.demo.entity.response.ExpertResponse;
import com.example.demo.enums.RoleEnum;
import com.example.demo.repository.ExpertRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExpertService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExpertRepository expertRepository;

    public ExpertService(UserRepository userRepository, PasswordEncoder passwordEncoder, ExpertRepository expertRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.expertRepository = expertRepository;
    }

    @Transactional
    public Expert createExpert(ExpertRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }

        // Kiểm tra nếu các trường bắt buộc không bị trống
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new RuntimeException("Name cannot be blank");
        }
        if (request.getPhone() == null || request.getPhone().isEmpty()) {
            throw new RuntimeException("Phone number must not be blank");
        }
        if (request.getAddress() == null || request.getAddress().isEmpty()) {
            throw new RuntimeException("Address cannot be blank");
        }

        Expert expert = new Expert();
        expert.setUsername(request.getUsername());
        expert.setPassword(passwordEncoder.encode(request.getPassword()));
        expert.setName(request.getName());
        expert.setPhone(request.getPhone());
        expert.setAddress(request.getAddress());
        expert.setSpecialty(request.getSpecialty());
        expert.setAvatar(request.getAvatar());
        expert.setCertificates(request.getCertificates());
        expert.setConsultingPrices(request.getConsultingPrices());
        expert.setWorkingSchedule(request.getWorkingSchedule());
        expert.setRoleEnum(RoleEnum.EXPERT);

        return userRepository.save(expert);
    }
    public ExpertResponse getExpertProfile(Long id) {
        Optional<Expert> expert = expertRepository.findById(id);
        if (expert.isPresent()) {
            Expert expertEntity = expert.get();

            // Chuyển đổi từ Expert entity sang ExpertResponse DTO
            ExpertResponse response = new ExpertResponse();
            response.setUsername(expertEntity.getUsername());
            response.setEmail(expertEntity.getEmail());
            response.setName(expertEntity.getName());
            response.setPhone(expertEntity.getPhone());
            response.setAddress(expertEntity.getAddress());
            response.setSpecialty(expertEntity.getSpecialty());
            response.setAvatar(expertEntity.getAvatar());
            response.setCertificates(expertEntity.getCertificates());
            response.setConsultingPrices(expertEntity.getConsultingPrices());
            response.setWorkingSchedule(expertEntity.getWorkingSchedule());

            return response;
        } else {
            return null; // Trả về null hoặc thông báo lỗi nếu không tìm thấy Expert
        }
    }
    public List<ExpertResponse> getAllExperts() {
        List<Expert> experts = expertRepository.findAll(); // Lấy tất cả expert từ database
        List<ExpertResponse> responseList = new ArrayList<>();

        for (Expert expert : experts) {
            ExpertResponse response = new ExpertResponse();
            response.setUsername(expert.getUsername());
            response.setEmail(expert.getEmail());
            response.setName(expert.getName());
            response.setPhone(expert.getPhone());
            response.setAddress(expert.getAddress());
            response.setSpecialty(expert.getSpecialty());
            response.setAvatar(expert.getAvatar());
            response.setCertificates(expert.getCertificates());

            // Kiểm tra và set consultingPrices và workingSchedule nếu có
            if (expert.getConsultingPrices() != null) {
                response.setConsultingPrices(expert.getConsultingPrices());
            }

            if (expert.getWorkingSchedule() != null) {
                response.setWorkingSchedule(expert.getWorkingSchedule());
            }

            responseList.add(response);
        }

        return responseList;
    }
}



