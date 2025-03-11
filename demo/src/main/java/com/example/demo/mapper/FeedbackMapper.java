package com.example.demo.mapper;

import com.example.demo.entity.Feedback;
import com.example.demo.entity.request.FeedbackRequest;
import org.modelmapper.PropertyMap;

public class FeedbackMapper extends PropertyMap<FeedbackRequest, Feedback> {
    @Override
    protected void configure() {
        map().setId(0);
    }
}
