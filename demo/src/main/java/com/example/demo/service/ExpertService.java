package com.example.demo.service;

import com.example.demo.entity.Certificate;
import com.example.demo.entity.Expert;
import com.example.demo.entity.User;
import com.example.demo.entity.request.CertificateRequest;
import com.example.demo.entity.request.ExpertRequest;
import com.example.demo.entity.response.ExpertResponse;
import com.example.demo.enums.CategoryEnum;
import com.example.demo.enums.RoleEnum;
import com.example.demo.repository.ExpertRepository;
import com.example.demo.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExpertService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExpertRepository expertRepository;
    private final JavaMailSender mailSender;

    public ExpertService(UserRepository userRepository, PasswordEncoder passwordEncoder, ExpertRepository expertRepository , JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.expertRepository = expertRepository;
        this.mailSender = mailSender;
    }
    // Helper method to validate specialty category
    private boolean isValidCategoryEnum(CategoryEnum specialty) {
        // Kiểm tra specialty có phải là một CategoryEnum hợp lệ không
        try {
            CategoryEnum.valueOf(specialty.name());
            return true;  // Return true if valid
        } catch (IllegalArgumentException e) {
            return false;  // Return false if the specialty is not valid
        }
    }
    @Transactional
    public Expert createExpert(ExpertRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username is already taken");
        }

        List<CategoryEnum> specialties = new ArrayList<>();
        if (request.getSpecialty().contains(CategoryEnum.ALL)) {
            specialties = Arrays.asList(CategoryEnum.TAMLY, CategoryEnum.TAICHINH, CategoryEnum.GIADINH,
                    CategoryEnum.SUCKHOE, CategoryEnum.GIAOTIEP, CategoryEnum.TONGIAO);
        } else {
            for (CategoryEnum specialty : request.getSpecialty()) {
                specialties.add(specialty);
            }
        }

        Expert expert = new Expert();
        expert.setUsername(request.getUsername());
        expert.setPassword(passwordEncoder.encode(request.getPassword()));
        expert.setName(request.getName());
        expert.setEmail(request.getEmail());
        expert.setPhone(request.getPhone());
        expert.setAddress(request.getAddress());
        expert.setSpecialty(specialties);
        expert.setAvatar(request.getAvatar());
        expert.setRoleEnum(RoleEnum.EXPERT);
        expert.setApproved(false);

        List<Certificate> certificates = new ArrayList<>();
        for (CertificateRequest certRequest : request.getCertificates()) {
            Certificate certificate = new Certificate(certRequest.getCertificateUrl(), certRequest.getCertificateName(), expert);
            certificates.add(certificate);
        }
        expert.setCertificates(certificates);

        return expertRepository.save(expert);
    }

    public ExpertResponse getExpertProfile(Long id) {
        Optional<Expert> expert = expertRepository.findById(id);
        if (expert.isPresent()) {
            Expert expertEntity = expert.get();
            ExpertResponse response = new ExpertResponse();
            response.setId(expertEntity.getId());
            response.setUsername(expertEntity.getUsername());
            response.setEmail(expertEntity.getEmail());
            response.setName(expertEntity.getName());
            response.setPhone(expertEntity.getPhone());
            response.setAddress(expertEntity.getAddress());

            if (expertEntity.getSpecialty().containsAll(Arrays.asList(CategoryEnum.values()))) {
                response.setSpecialty(Arrays.asList(CategoryEnum.ALL));
            } else {
                response.setSpecialty(expertEntity.getSpecialty());
            }

            response.setAvatar(expertEntity.getAvatar());
            response.setCertificates(expertEntity.getCertificates());
            response.setApproved(expertEntity.isApproved());

            return response;
        } else {
            return null;
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
            // Kiểm tra xem chuyên môn của expert có phải là tất cả chuyên môn không
            // Kiểm tra xem chuyên môn của expert có phải là tất cả chuyên môn không
            if (expert.getSpecialty().contains(CategoryEnum.ALL)) {
                // Nếu chuyên môn là ALL, trả về danh sách chứa CategoryEnum.ALL
                response.setSpecialty(Arrays.asList(CategoryEnum.ALL));
            } else {
                // Nếu không phải tất cả chuyên môn, giữ nguyên kiểu CategoryEnum và chỉ cần trả về danh sách CategoryEnum
                response.setSpecialty(expert.getSpecialty());  // Trả về các CategoryEnum đã chọn
            }

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
                if (request.getSpecialty().contains(CategoryEnum.ALL)) {
                    expert.setSpecialty(Arrays.asList(CategoryEnum.TAMLY, CategoryEnum.TAICHINH, CategoryEnum.GIADINH,
                            CategoryEnum.SUCKHOE, CategoryEnum.GIAOTIEP, CategoryEnum.TONGIAO)); // Include all categories
                } else {
                    List<CategoryEnum> specialties = new ArrayList<>();
                    for (CategoryEnum specialty : request.getSpecialty()) {
                        if (isValidCategoryEnum(specialty)) {
                            specialties.add(specialty);
                        } else {
                            throw new RuntimeException("Invalid specialty category: " + specialty);
                        }
                    }
                    expert.setSpecialty(specialties);  // Gán lại danh sách chuyên môn đã cập nhật
                }
            }

            if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
                expert.setAvatar(request.getAvatar());
            }

            // Kiểm tra và cập nhật chứng chỉ
            if (request.getCertificates() != null && !request.getCertificates().isEmpty()) {
                List<Certificate> certificates = new ArrayList<>();
                for (CertificateRequest certRequest : request.getCertificates()) {
                    // Tạo mới Certificate từ CertificateRequest
                    Certificate certificate = new Certificate(certRequest.getCertificateUrl(), certRequest.getCertificateName(), expert);
                    certificates.add(certificate);
                }
                expert.setCertificates(certificates);  // Gán danh sách chứng chỉ vào Expert
            }

            // Cập nhật mật khẩu nếu có thay đổi
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                expert.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            expert.setApproved(true);  // Đảm bảo rằng chuyên gia đã được phê duyệt

            return expertRepository.save(expert);  // Lưu cập nhật vào cơ sở dữ liệu
        } else {
            throw new RuntimeException("Expert not found with id: " + id);
        }
    }





    // Phê duyệt Expert
    // Phê duyệt Expert
    public boolean approveExpert(Long id) {
        // Tìm Expert theo ID
        Expert expert = expertRepository.findById(id).orElseThrow(() -> new RuntimeException("Expert not found"));

        // Cập nhật trạng thái phê duyệt
        expert.setApproved(true);
        expertRepository.save(expert);

        // Gửi email thông báo khi phê duyệt
        try {
            sendApprovalEmail(expert.getEmail(), true); // Gửi email cho expert
        } catch (MessagingException e) {
            e.printStackTrace();
            return false; // Nếu có lỗi gửi email thì trả về false
        }

        return true; // Trả về true nếu phê duyệt thành công và email được gửi
    }

    // Reject Expert
    // Từ chối Expert
    public boolean rejectExpert(Long id) {
        // Tìm Expert theo ID
        Expert expert = expertRepository.findById(id).orElseThrow(() -> new RuntimeException("Expert not found"));

        // Cập nhật trạng thái từ chối
        expert.setApproved(false);
        expertRepository.save(expert);

        // Gửi email thông báo khi từ chối
        try {
            sendApprovalEmail(expert.getEmail(), false); // Gửi email cho expert
        } catch (MessagingException e) {
            e.printStackTrace();
            return false; // Nếu có lỗi gửi email thì trả về false
        }

        return true; // Trả về true nếu từ chối thành công và email được gửi
    }

        // Phương thức gửi email thông báo phê duyệt hoặc từ chối
        private void sendApprovalEmail(String recipientEmail, boolean isApproved) throws MessagingException {
            // Tạo đối tượng MimeMessage
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Địa chỉ email người gửi
            helper.setFrom("gbaogia111@gmail.com");  // Thay thế bằng địa chỉ email của bạn
            helper.setTo(recipientEmail); // Địa chỉ email của expert
            helper.setSubject(isApproved ? "Your Expert Application is Approved" : "Your Expert Application is Rejected");

            // Nội dung email
            String text = isApproved
                    ? "Congratulations! Your application has been approved."
                    : "Sorry, your application has been rejected.";
            helper.setText(text); // Cập nhật nội dung email

            // Gửi email
            mailSender.send(message);
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
            // Kiểm tra xem nếu chuyên môn của expert có phải là tất cả chuyên môn
            if (expert.getSpecialty().containsAll(Arrays.asList(CategoryEnum.values()))) {
                response.setSpecialty(Arrays.asList(CategoryEnum.ALL));  // Hiển thị "Tất cả chuyên môn"
            } else {
                response.setSpecialty(expert.getSpecialty());  // Hiển thị các chuyên môn đã chọn
            }
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
                if (request.getSpecialty().contains(CategoryEnum.ALL)) {
                    expert.setSpecialty(Arrays.asList(CategoryEnum.TAMLY, CategoryEnum.TAICHINH, CategoryEnum.GIADINH,
                            CategoryEnum.SUCKHOE, CategoryEnum.GIAOTIEP, CategoryEnum.TONGIAO)); // Include all categories
                } else {
                    List<CategoryEnum> specialties = new ArrayList<>();
                    for (CategoryEnum specialty : request.getSpecialty()) {
                        if (isValidCategoryEnum(specialty)) {
                            specialties.add(specialty);
                        } else {
                            throw new RuntimeException("Invalid specialty category: " + specialty);
                        }
                    }
                    expert.setSpecialty(specialties);
                }
            }

            if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
                expert.setAvatar(request.getAvatar());
            }
            // Chuyển đổi từ CertificateRequest sang Certificate trước khi gán vào Expert
            if (request.getCertificates() != null && !request.getCertificates().isEmpty()) {
                List<Certificate> certificates = new ArrayList<>();
                for (CertificateRequest certRequest : request.getCertificates()) {
                    // Chuyển CertificateRequest thành Certificate và liên kết với Expert
                    Certificate certificate = new Certificate(certRequest.getCertificateUrl(), certRequest.getCertificateName(), expert);
                    certificates.add(certificate);  // Thêm vào danh sách chứng chỉ
                }

                expert.setCertificates(certificates);  // Gán danh sách chứng chỉ vào Expert
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



