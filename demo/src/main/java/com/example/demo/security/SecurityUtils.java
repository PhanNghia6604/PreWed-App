package com.example.demo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.io.IOException;

/**
 * Security utils class
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class SecurityUtils {

    /**
     * response when occurring exception in security
     * @param response response data
     * @param status status code
     * @param message response message
     * @throws IOException exception
     */
    public static void responseFailCredential(HttpServletResponse response, HttpStatus status, String message) throws IOException {

        // set header
        response.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        // set status
        response.setStatus(status.value());

        // write message and return
        new ObjectMapper()
                .writeValue(response.getOutputStream(), message);
        response.flushBuffer();
    }
}
