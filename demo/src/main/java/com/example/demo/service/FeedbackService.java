package com.example.demo.service;

import com.example.demo.entity.Feedback;
import com.example.demo.entity.request.FeedbackRequest;
import com.example.demo.repository.FeedbackRepository;
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
    public Feedback newFeedback(FeedbackRequest feedbackRequest){
        Feedback newFeedback = modelMapper.map(feedbackRequest, Feedback.class);
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
        return feedbackRepository.save(feedback);
    }
}
