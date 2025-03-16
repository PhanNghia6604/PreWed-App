package com.example.demo.service;

import com.example.demo.entity.Expert;
import com.example.demo.entity.Feedback;
import com.example.demo.entity.request.FeedbackRequest;
import com.example.demo.repository.ExpertRepository;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.utils.UserUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    FeedbackRepository feedbackRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    ExpertRepository expertRepository;
    @Autowired
    UserUtils userUtils;
    public Feedback newFeedback(FeedbackRequest feedbackRequest) {
        Feedback newFeedback = modelMapper.map(feedbackRequest, Feedback.class);

        Expert expert = expertRepository.findById(feedbackRequest.getExpertId())
                .orElseThrow(() -> new IllegalArgumentException("Expert not found with ID: " + feedbackRequest.getExpertId()));

        newFeedback.setExpert(expert);
        newFeedback.setUser(userUtils.getCurrentUser());
        return feedbackRepository.save(newFeedback);
    }
    public List<Feedback> getAllFeedback(){
        return feedbackRepository.findFeedbacksByIsDeletedFalse();
    }
    public Feedback getFeedbackById(long id){
        return feedbackRepository.findFeedbackById(id);
    }
    public Feedback delete(long id){
        Feedback feedback = feedbackRepository.findFeedbackById(id);
        feedback.isDeleted = true;
        return feedbackRepository.save(feedback);
    }

    public Feedback updateFeedback(long id, FeedbackRequest feedbackRequest) {
        Feedback feedback = getFeedbackById(id);

        feedback.setRating(feedbackRequest.getRating());
        feedback.setComments(feedbackRequest.getComments());

        // Update Expert if provided
        if (feedbackRequest.getExpertId() != null) {
            Expert expert = expertRepository.findById(feedbackRequest.getExpertId())
                    .orElseThrow(() -> new IllegalArgumentException("Expert not found with ID: " + feedbackRequest.getExpertId()));
            feedback.setExpert(expert);
        }

        return feedbackRepository.save(feedback);
    }
}
