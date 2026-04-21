package com.example.SmartTask.repository;

import com.example.SmartTask.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
Optional<PasswordResetToken> findByToken(String token);
}