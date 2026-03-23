package com.example.SmartTask.repository;

import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User,String> {
    @Query(value = "SELECT * FROM users WHERE user_name LIKE %?1% ", nativeQuery=true)
    Page<User> searchAll(String searchText, Pageable pageable);

    Optional<User> findByEmail(String email);

}
