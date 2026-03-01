package com.example.SmartTask.repository;

import com.example.SmartTask.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task,String> {
}
