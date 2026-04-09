package com.example.SmartTask.dto.response.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDto {
    private String token;
    private ResponseUserDto user;

    public LoginResponseDto(String token, ResponseUserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public ResponseUserDto getUser() { return user; }
}