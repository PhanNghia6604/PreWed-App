package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice //danh dau class dung de handle exception cua api
public class APIHandleException {
    //mỗi khi có lỗi validation thì chạy xử lí này

    //MethodArgumentNotValidException
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity handleBadRequestException(MethodArgumentNotValidException exception){
        String messages = "";

        for(FieldError error: exception.getBindingResult().getFieldErrors()){
            messages += error.getDefaultMessage() + "\n";

        }
        return new ResponseEntity(messages, HttpStatus.BAD_REQUEST);
    }
}
