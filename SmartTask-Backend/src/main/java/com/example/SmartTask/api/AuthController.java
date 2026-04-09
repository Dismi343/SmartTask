package com.example.SmartTask.api;

import com.example.SmartTask.dto.request.RequestLoginDto;
import com.example.SmartTask.dto.response.response.LoginResponseDto;
import com.example.SmartTask.dto.response.response.ResponseUserDto;
import com.example.SmartTask.entity.User;
import com.example.SmartTask.repository.UserRepo;
import com.example.SmartTask.service.JwtService;
import com.example.SmartTask.service.UserService;
import com.example.SmartTask.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<StandardResponseDto> login(@RequestBody RequestLoginDto loginDto) {
        String token= userService.userLogin(loginDto.getEmail(), loginDto.getPassword());
        ResponseUserDto user=userService.findByEmail(loginDto.getEmail());
        LoginResponseDto loginResponse = new LoginResponseDto(token, user);

        return new ResponseEntity<>(
                    new StandardResponseDto(
                            "Login successful",200,loginResponse
                    ), HttpStatus.OK
            );
    }
}
