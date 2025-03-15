package com.example.demo.api;


import com.example.demo.entity.Feedback;
import com.example.demo.entity.request.FeedbackRequest;
import com.example.demo.service.FeedbackService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/feedback")
public class FeedbackAPI {
    @Autowired
    FeedbackService feedbackService;

    @PostMapping
    @Secured("ROLE_CUSTOMER")
    public ResponseEntity createFeedback(@Valid @RequestBody FeedbackRequest feedbackRequest) {
        Feedback newServicePackage = feedbackService.newFeedback(feedbackRequest);
        return ResponseEntity.ok(newServicePackage);
    }

    @GetMapping
    @Secured({"ROLE_CUSTOMER", "ROLE_EXPERT"})
    public ResponseEntity getFeedback() {
        List<Feedback> feedbacks = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("{id}")
    @Secured({"ROLE_CUSTOMER", "ROLE_EXPERT"})
    public  ResponseEntity getFeedbackById(@PathVariable long id){
        Feedback feedback = feedbackService.getFeedbackById(id);
       return ResponseEntity.ok(feedback);
    }

    @DeleteMapping("{id}")
    @Secured("ROLE_CUSTOMER")
    public ResponseEntity deleteFeedback(@PathVariable long id){
        Feedback feedback = feedbackService.delete(id);
        return ResponseEntity.ok(feedback);
    }

    @PutMapping("{id}")
    @Secured("ROLE_CUSTOMER")
    public ResponseEntity updateFeedback(@PathVariable long id, @RequestBody FeedbackRequest feedbackRequest){
        Feedback feedback = feedbackService.updateFeedback(id, feedbackRequest);
        return ResponseEntity.ok(feedback);
    }
}
