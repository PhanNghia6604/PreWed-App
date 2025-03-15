package com.example.demo;

import com.example.demo.config.properties.VnPayProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({VnPayProperties.class})
public class PreMarriageApplication {
	public static void main(String[] args) {
		SpringApplication.run(PreMarriageApplication.class, args);
	}
}
