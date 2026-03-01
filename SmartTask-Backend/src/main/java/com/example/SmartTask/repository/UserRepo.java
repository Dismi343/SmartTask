package com.example.SmartTask.repository;

import com.example.SmartTask.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,String> {
}
