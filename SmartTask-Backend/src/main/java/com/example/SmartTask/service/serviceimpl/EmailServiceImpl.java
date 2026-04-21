package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Override
    public void sendResetEmail(String email, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click here to reset your password: " + resetLink);

        mailSender.send(message);
    }
}


