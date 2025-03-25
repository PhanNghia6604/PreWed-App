package com.example.demo.service;

import com.example.demo.entity.Expert;
import com.example.demo.entity.User;
import com.example.demo.entity.request.ExpertRequest;
import com.example.demo.entity.response.ExpertResponse;
import com.example.demo.enums.RoleEnum;
import com.example.demo.repository.ExpertRepository;
import com.example.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        expert.setEmail(request.getEmail());
        expert.setPhone(request.getPhone());
        expert.setAddress(request.getAddress());
        expert.setSpecialty(request.getSpecialty());
        expert.setAvatar(request.getAvatar());
        expert.setCertificates(request.getCertificates());
        expert.setRoleEnum(RoleEnum.EXPERT);
        expert.setApproved(false);

        return userRepository.save(expert);
    }
    public ExpertResponse getExpertProfile(Long id) {
        Optional<Expert> expert = expertRepository.findById(id);
        if (expert.isPresent()) {
            Expert expertEntity = expert.get();

            // Chuyển đổi từ Expert entity sang ExpertResponse DTO
            ExpertResponse response = new ExpertResponse();
            response.setId(expertEntity.getId());
            response.setUsername(expertEntity.getUsername());
            response.setEmail(expertEntity.getEmail());
            response.setName(expertEntity.getName());
            response.setPhone(expertEntity.getPhone());
            response.setAddress(expertEntity.getAddress());
            response.setSpecialty(expertEntity.getSpecialty());
            response.setAvatar(expertEntity.getAvatar());
            response.setCertificates(expertEntity.getCertificates());
            response.setApproved(expertEntity.isApproved());


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
            response.setId(expert.getId());
            response.setUsername(expert.getUsername());
            response.setEmail(expert.getEmail());
            response.setName(expert.getName());
            response.setPhone(expert.getPhone());
            response.setAddress(expert.getAddress());
            response.setSpecialty(expert.getSpecialty());
            response.setAvatar(expert.getAvatar());
            response.setCertificates(expert.getCertificates());
            response.setApproved(expert.isApproved());

            responseList.add(response);
        }

        return responseList;
    }
    @Transactional
    public Expert updateExpertbyID(Long id, ExpertRequest request) {
        Optional<Expert> existingExpert = expertRepository.findById(id);

        if (existingExpert.isPresent()) {
            Expert expert = existingExpert.get();

            // Kiểm tra và cập nhật các trường thông tin
            if (request.getName() != null && !request.getName().isEmpty()) {
                expert.setName(request.getName());
            }
            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                expert.setPhone(request.getPhone());
            }
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                expert.setAddress(request.getAddress());
            }
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                expert.setEmail(request.getEmail());
            }
            if (request.getSpecialty() != null && !request.getSpecialty().isEmpty()) {
                expert.setSpecialty(request.getSpecialty());
            }
            if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
                expert.setAvatar(request.getAvatar());
            }
            if (request.getCertificates() != null && !request.getCertificates().isEmpty()) {
                expert.setCertificates(request.getCertificates());
            }

            // Cập nhật mật khẩu nếu có thay đổi
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                expert.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            expert.setApproved(true);


            return expertRepository.save(expert);
        } else {
            throw new RuntimeException("Expert not found with id: " + id);
        }
    }
    @Transactional
    public boolean approveExpert(Long id) {
        Optional<Expert> expertOpt = expertRepository.findById(id);
        if (expertOpt.isPresent()) {
            Expert expert = expertOpt.get();
            expert.setApproved(true);
            expertRepository.save(expert);
            return true;
        }
        return false;
    }
    public List<ExpertResponse> getPendingExperts() {
        List<Expert> pendingExperts = expertRepository.findByApprovedFalse();
        List<ExpertResponse> responses = new ArrayList<>();

        for (Expert expert : pendingExperts) {
            ExpertResponse response = new ExpertResponse();
            response.setId(expert.getId());
            response.setUsername(expert.getUsername());
            response.setEmail(expert.getEmail());
            response.setName(expert.getName());
            response.setPhone(expert.getPhone());
            response.setAddress(expert.getAddress());
            response.setSpecialty(expert.getSpecialty());
            response.setAvatar(expert.getAvatar());
            response.setCertificates(expert.getCertificates());
            response.setApproved(expert.isApproved());
            responses.add(response);
        }

        return responses;
    }

    @Transactional
    public Expert updateExpert(ExpertRequest request) {
        // Lấy thông tin người dùng hiện tại
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Lấy tên người dùng (hoặc có thể là ID người dùng tùy vào cách bạn lưu thông tin người dùng)

        Optional<Expert> existingExpert = expertRepository.findByUsername(username);

        if (existingExpert.isPresent()) {
            Expert expert = existingExpert.get();

            // Kiểm tra và cập nhật các trường thông tin
            if (request.getName() != null && !request.getName().isEmpty()) {
                expert.setName(request.getName());
            }
            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                expert.setPhone(request.getPhone());
            }
            if (request.getAddress() != null && !request.getAddress().isEmpty()) {
                expert.setAddress(request.getAddress());
            }
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                expert.setEmail(request.getEmail());
            }
            if (request.getSpecialty() != null && !request.getSpecialty().isEmpty()) {
                expert.setSpecialty(request.getSpecialty());
            }
            if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
                expert.setAvatar(request.getAvatar());
            }
            if (request.getCertificates() != null && !request.getCertificates().isEmpty()) {
                expert.setCertificates(request.getCertificates());
            }

            // Cập nhật mật khẩu nếu có thay đổi
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                expert.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            return expertRepository.save(expert);
        } else {
            throw new RuntimeException("Expert not found");
        }

    }


}



