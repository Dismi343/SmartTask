package com.example.SmartTask.api;

import com.example.SmartTask.dto.request.PasswordResetDto;
import com.example.SmartTask.dto.request.RequestLoginDto;
import com.example.SmartTask.dto.response.response.LoginResponseDto;
import com.example.SmartTask.dto.response.response.ResponseUserDto;
import com.example.SmartTask.entity.PasswordResetToken;
import com.example.SmartTask.entity.User;
import com.example.SmartTask.repository.PasswordResetTokenRepository;
import com.example.SmartTask.repository.UserRepo;
import com.example.SmartTask.service.EmailService;
import com.example.SmartTask.service.JwtService;
import com.example.SmartTask.service.UserService;
import com.example.SmartTask.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    @GetMapping("/me")
    public String getCurrentUser(Authentication authentication) {
        return jwtService.getActiveUser();
    }


    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepo.save(resetToken);

        emailService.sendResetEmail(email, token);

        return "Reset email sent!";
    }



    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody PasswordResetDto passwordResetDto) {

        PasswordResetToken resetToken = tokenRepo.findByToken(passwordResetDto.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(passwordResetDto.getNewPassword()));

        userRepository.save(user);

        return "Password successfully reset!";
    }
}
