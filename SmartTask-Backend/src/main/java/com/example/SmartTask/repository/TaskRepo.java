package com.example.SmartTask.repository;

import com.example.SmartTask.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TaskRepo extends JpaRepository<Task,String> {
    @Query(value = "SELECT * FROM tasks WHERE taskTitle LIKE %?1% ", nativeQuery=true)
    Page<Task> searchAll(String searchText, Pageable pageable);
}
