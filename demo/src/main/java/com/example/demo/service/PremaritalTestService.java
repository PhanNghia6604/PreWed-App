package com.example.demo.service;


import com.example.demo.entity.Answer;
import com.example.demo.entity.Diagnos;
import com.example.demo.entity.PremaritalTest;
import com.example.demo.entity.request.PremaritalTestRequest;
import com.example.demo.entity.response.DiagnosResponse;
import com.example.demo.enums.CategoryEnum;
import com.example.demo.repository.PremaritalTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PremaritalTestService {

    @Autowired
    private PremaritalTestRepository premaritalTestRepository;
    @Autowired
    private DiagnosService diagnosService;

    public DiagnosResponse evaluateTest(PremaritalTestRequest testRequest) {
        Set<String> categoriesToImprove = new HashSet<>(); // Using a Set to prevent duplicates
        List<String> reasons = new ArrayList<>();
        List<String> consultations = new ArrayList<>();
        int criticalIssuesCount = 0;

        // Loop through all the answers
        for (Answer answer : testRequest.getAnswers()) {
            if (answer.getScore() == 1) {  // If the answer requires improvement
                categoriesToImprove.add(answer.getCategory().name()); // Add category to the set
                criticalIssuesCount++;
            }
        }

        // Convert the categories to Vietnamese names
        List<String> categoriesInVietnamese = new ArrayList<>();
        for (String category : categoriesToImprove) {
            String categoryInVietnamese = CategoryEnum.valueOf(category).getCategoryName(); // Get the translated name
            categoriesInVietnamese.add(categoryInVietnamese);
        }

        // For categories that need improvement, use getImprovementReason for one category
        // or getCombinedImprovementReason if there are multiple categories
        if (categoriesInVietnamese.size() == 1) {
            // Only one category
            for (String category : categoriesInVietnamese) {
                reasons.add(getImprovementReason(category));
                consultations.add(getConsultationRecommendation(category));
            }

        } else if (categoriesInVietnamese.size() >= 2) {
            // Multiple categories
            reasons.add(getCombinedImprovementReason(testRequest.getAnswers()));
            consultations.add(getCombinedConsultationRecommendation(categoriesInVietnamese));
        }

        // Create Diagnosis Result
        Diagnos diagnos = new Diagnos();
        diagnos.setCategoriesToImprove(categoriesInVietnamese); // Set the categories in Vietnamese
        diagnos.setDiagnosisResult(generateDiagnosisResult(criticalIssuesCount));
        diagnos.setPremaritalTest(new PremaritalTest());  // Link to the premarital test

        // Save the diagnosis to the database if needed
        // Save logic for diagnos and premaritalTest...

        // Return DiagnosResponse
        return diagnosService.createDiagnosResponse(categoriesInVietnamese, reasons, consultations);
    }

    private String generateDiagnosisResult(int criticalIssuesCount) {
        if (criticalIssuesCount > 3) {
            return "Có quá nhiều vấn đề nghiêm trọng cần cải thiện. Đề nghị gặp chuyên gia tư vấn toàn diện về mối quan hệ hôn nhân.";
        } else if (criticalIssuesCount > 0) {
            return "Có một số vấn đề cần cải thiện, nhưng tình hình không quá nghiêm trọng. Cần thảo luận kỹ lưỡng hơn về các vấn đề này và có thể xem xét gặp chuyên gia nếu cần.";
        } else {
            return "Tất cả các chuyên môn đều ổn.";
        }
    }

    private String getImprovementReason(String category) {
        switch (category) {
            case "Tâm lý":
                return "Bạn cảm thấy khó khăn khi đối mặt với các thử thách lớn trong cuộc sống và chưa chia sẻ cảm xúc nhiều với người thân.";
            case "Tài chính":
                return "Cần phải có một kế hoạch tài chính rõ ràng hơn trong mối quan hệ, đặc biệt là về việc lập ngân sách chung.";
            case "Sức khỏe":
                return "Cần cải thiện thói quen chăm sóc sức khỏe cá nhân và thể chất trong mối quan hệ.";
            case "Giao tiếp":
                return "Cần cải thiện khả năng giao tiếp, đặc biệt là trong việc giải quyết mâu thuẫn và chia sẻ cảm xúc với đối tác.";
            case "Gia đình":
                return "Cần thảo luận rõ ràng về kỳ vọng và vai trò trong gia đình, đặc biệt là về việc nuôi dạy con cái và chia sẻ trách nhiệm.";
            case "Tôn giáo":
                return "Cần thảo luận thêm về tôn giáo và cách thức tích hợp các hoạt động tôn giáo vào cuộc sống hôn nhân.";
            default:
                return "Cần cải thiện trong lĩnh vực này.";
        }
    }

    private String getCombinedImprovementReason(List<Answer> answers) {
        StringBuilder reasons = new StringBuilder();

        List<String> categories = new ArrayList<>();
        for (Answer answer : answers) {
            categories.add(answer.getCategory().name());
        }

        // Combine improvement reasons for multiple categories
        if (categories.contains("TAICHINH") && categories.contains("SUCKHOE")) {
            reasons.append("Cả hai yếu tố này đều ảnh hưởng trực tiếp đến mối quan hệ: căng thẳng tài chính có thể gây ra stress, ảnh hưởng đến tâm lý, trong khi không chăm sóc sức khỏe có thể dẫn đến các vấn đề về thể chất và cảm xúc, làm giảm chất lượng mối quan hệ.");
        } else if (categories.contains("TAMLY") && categories.contains("GIAOTIEP")) {
            reasons.append("Khi có vấn đề tâm lý chưa được giải quyết, giao tiếp sẽ gặp khó khăn, gây ra hiểu lầm và xung đột. Hãy cải thiện khả năng chia sẻ để tạo sự gắn kết và hiểu nhau hơn.");
        } else if (categories.contains("GIADINH") && categories.contains("TONGIAO")) {
            reasons.append("Sự khác biệt về quan điểm gia đình và tín ngưỡng có thể tạo ra khoảng cách trong mối quan hệ. Cần thảo luận rõ ràng để hiểu và tôn trọng lẫn nhau.");
        } else if (categories.contains("TAMLY") && categories.contains("TAICHINH") && categories.contains("SUCKHOE")) {
            reasons.append("Tâm lý, tài chính và sức khỏe là ba yếu tố tạo nên sự ổn định trong mối quan hệ. Thiếu sự cân bằng giữa ba yếu tố này sẽ dễ dẫn đến căng thẳng và mâu thuẫn.");
        } else if (categories.contains("TAMLY") && categories.contains("GIAOTIEP") && categories.contains("GIADINH")) {
            reasons.append("Khả năng giao tiếp sẽ giúp bạn giải quyết các vấn đề tâm lý và gia đình một cách hiệu quả, tạo ra không gian để cả hai cùng chia sẻ và hiểu nhau hơn.");
        } else if (categories.contains("TAICHINH") && categories.contains("GIADINH")) {
            reasons.append("Khi tài chính trong gia đình không ổn định, nó sẽ ảnh hưởng đến sự hòa thuận và hạnh phúc. Lập kế hoạch tài chính rõ ràng giúp giảm bớt căng thẳng và tạo ra sự đồng thuận.");
        } else if (categories.contains("TAICHINH") && categories.contains("TONGIAO")) {
            reasons.append("Cân bằng giữa tín ngưỡng và tài chính sẽ giúp bạn tránh được những xung đột không đáng có và xây dựng mối quan hệ vững chắc hơn.");
        } else if (categories.contains("GIAOTIEP") && categories.contains("TONGIAO")) {
            reasons.append("Việc chia sẻ quan điểm tôn giáo và lắng nghe nhau sẽ giúp bạn hiểu và tôn trọng sự khác biệt, từ đó cải thiện khả năng giao tiếp trong mối quan hệ.");
        } else if (categories.contains("TAMLY") && categories.contains("TAICHINH") && categories.contains("SUCKHOE") && categories.contains("GIAOTIEP") && categories.contains("GIADINH") && categories.contains("TONGIAO")) {
            reasons.append("Việc chia sẻ quan điểm tôn giáo và lắng nghe nhau sẽ giúp bạn hiểu và tôn trọng sự khác biệt, từ đó cải thiện khả năng giao tiếp trong mối quan hệ.");
        } else {
            reasons.append("Cần cải thiện trong các lĩnh vực này.");
        }

        return reasons.toString();
    }

    private String getConsultationRecommendation(String category) {
        switch (category) {
            case "Tâm lý":
                return "Vấn đề tâm lý cần được xem xét thêm với chuyên gia tư vấn hôn nhân hoặc tâm lý.";
            case "Tài chính":
                return "Nếu có sự bất đồng nghiêm trọng về tài chính, bạn có thể cần tư vấn tài chính hôn nhân từ chuyên gia.";
            case "Sức khỏe":
                return "Nếu sức khỏe tâm lý ảnh hưởng đến mối quan hệ, tham khảo ý kiến chuyên gia tâm lý.";
            case "Giao tiếp":
                return "Cần thảo luận thêm về giao tiếp và cách giải quyết xung đột trong mối quan hệ. Bạn có thể cần gặp chuyên gia tư vấn giao tiếp.";
            case "Gia đình":
                return "Nếu có sự không đồng thuận về các vấn đề gia đình, bạn có thể cần gặp chuyên gia tư vấn hôn nhân hoặc gia đình.";
            case "Tôn giáo":
                return "Nếu có sự mâu thuẫn lớn về tín ngưỡng, bạn có thể cần gặp chuyên gia tư vấn tôn giáo.";
            default:
                return "Cần tư vấn thêm về lĩnh vực này.";
        }
    }

    private String getCombinedConsultationRecommendation(List<String> categories) {
        StringBuilder consultations = new StringBuilder();

        // Combine financial and health
        if (categories.contains("TAICHINH") && categories.contains("SUCKHOE")) {
            consultations.append("Để đạt được sự ổn định trong cuộc sống, bạn cần cân bằng giữa sức khỏe và tài chính cá nhân. Một kế hoạch tài chính hợp lý và một lối sống lành mạnh sẽ giúp bạn vượt qua thử thách và phát triển mối quan hệ bền vững.");
        }
        // Combine mental health and communication
        else if (categories.contains("TAMLY") && categories.contains("GIAOTIEP")) {
            consultations.append("Cải thiện giao tiếp trong mối quan hệ là rất quan trọng, đặc biệt khi bạn đang đối mặt với các vấn đề tâm lý. Hãy cởi mở chia sẻ cảm xúc của mình và lắng nghe đối tác để giải quyết vấn đề một cách hiệu quả.");
        }
        // Combine family and religion
        else if (categories.contains("GIADINH") && categories.contains("TONGIAO")) {
            consultations.append("Mối quan hệ gia đình có thể bị ảnh hưởng bởi sự khác biệt về tín ngưỡng. Hãy thảo luận rõ ràng về các giá trị tôn giáo và gia đình để tạo ra sự hòa hợp và thấu hiểu trong mối quan hệ.");
        }
        // Combine mental health, financial and health
        else if (categories.contains("TAMLY") && categories.contains("TAICHINH") && categories.contains("SUCKHOE")) {
            consultations.append("Một mối quan hệ vững mạnh cần sự cân bằng giữa tâm lý, tài chính và sức khỏe. Hãy đặt mục tiêu cải thiện đồng thời các yếu tố này để tạo nền tảng vững chắc cho cuộc sống hạnh phúc và bền vững.");
        }
        // Combine mental health, communication and family
        else if (categories.contains("TAMLY") && categories.contains("GIAOTIEP") && categories.contains("GIADINH")) {
            consultations.append("Cải thiện khả năng giao tiếp trong gia đình là chìa khóa giúp giải quyết các vấn đề tâm lý và gia đình. Hãy tạo không gian cho các cuộc trò chuyện cởi mở và thấu hiểu để xây dựng mối quan hệ gia đình mạnh mẽ.");
        }
        // Combine finance and family
        else if (categories.contains("TAICHINH") && categories.contains("GIADINH")) {
            consultations.append("Cần có sự thỏa thuận rõ ràng về tài chính và vai trò trong gia đình để xây dựng một cuộc sống hôn nhân hài hòa. Một kế hoạch tài chính hợp lý sẽ giúp giảm thiểu căng thẳng trong mối quan hệ gia đình.");
        }
        // Combine finance and religion
        else if (categories.contains("TAICHINH") && categories.contains("TONGIAO")) {
            consultations.append("Việc kết hợp giữa tín ngưỡng và tài chính có thể tạo ra sự mâu thuẫn trong mối quan hệ. Hãy thảo luận về cách cân bằng giữa các nghĩa vụ tài chính và trách nhiệm tôn giáo để đạt được sự hòa hợp.");
        }
        // Combine communication and religion
        else if (categories.contains("GIAOTIEP") && categories.contains("TONGIAO")) {
            consultations.append("Các quan điểm tôn giáo có thể ảnh hưởng đến giao tiếp trong mối quan hệ. Hãy thảo luận và chia sẻ những giá trị tôn giáo để tìm ra cách giải quyết xung đột một cách hiệu quả.");
        }
        // Combine all categories
        else if (categories.contains("TAMLY") && categories.contains("TAICHINH") && categories.contains("SUCKHOE") && categories.contains("GIAOTIEP") && categories.contains("GIADINH") && categories.contains("TONGIAO")) {
            consultations.append("Hãy cải thiện và phát triển tất cả các yếu tố trong mối quan hệ của bạn: tâm lý, tài chính, sức khỏe, giao tiếp, gia đình và tín ngưỡng. Điều này sẽ giúp bạn xây dựng một mối quan hệ toàn diện và hạnh phúc.");
        }
        // If no combination
        else {
            consultations.append("Cần thảo luận thêm về các khía cạnh này để tìm cách cải thiện mối quan hệ.");
        }

        return consultations.toString();
    }

    public List<PremaritalTest> getTestHistory(Long userId) {
        return premaritalTestRepository.findByUserId(userId);
    }
}


