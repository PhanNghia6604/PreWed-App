package com.example.demo.service;

import com.example.demo.entity.Feedback;
import com.example.demo.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    FeedbackRepository feedbackRepository;
    public Feedback newFeedback(Feedback feedback){
        Feedback newFeedback = feedbackRepository.save(feedback);
        return newFeedback;
    }
    public List<Feedback> getAllServicePackage(){
        return feedbackRepository.findFeedbacksByIsDeletedFalse();
    }
    public Feedback getServicesPackageById(long id){
        return feedbackRepository.findFeedbackById(id);
    }
    public Feedback delete(long id){
        Feedback feedback = feedbackRepository.findFeedbackById(id);
        feedback.isDeleted = true;
        return feedbackRepository.save(feedback);
    }

}
