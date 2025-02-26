package com.example.demo.api;


import com.example.demo.entity.Feedback;
import com.example.demo.service.FeedbackService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/feedback")
@SecurityRequirement(name = "api")
public class FeedbackAPI {
    @Autowired
    FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity createFeedback(@Valid @RequestBody Feedback feedback) {
        Feedback newServicePackage = feedbackService.newFeedback(feedback);
        return ResponseEntity.ok(newServicePackage);
    }
    @GetMapping
    public ResponseEntity getFeedback() {
        List<Feedback> feedbacks = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbacks);
    }
    @DeleteMapping("{id}")
    public ResponseEntity deleteFeedback(@PathVariable long id){
        Feedback feedback = feedbackService.delete(id);
        return ResponseEntity.ok(feedback);
    }
}
