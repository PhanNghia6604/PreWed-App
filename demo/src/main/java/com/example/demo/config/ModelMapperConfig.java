package com.example.demo.config;

import com.example.demo.mapper.PreMarriageServiceMapper;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addMappings(new PreMarriageServiceMapper());
        return modelMapper;
    }
}
