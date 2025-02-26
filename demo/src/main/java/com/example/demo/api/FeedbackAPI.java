package com.example.demo.api;


import com.example.demo.entity.Feedback;
import com.example.demo.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/feedback")
public class FeedbackAPI {
    @Autowired
    FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity createFeedback(@Valid @RequestBody Feedback feedback) {
        Feedback newServicePackage = feedbackService.newFeedback(feedback);
        return ResponseEntity.ok(newServicePackage);
    }

}
