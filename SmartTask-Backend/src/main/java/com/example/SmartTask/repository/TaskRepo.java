package com.example.SmartTask.repository;

import com.example.SmartTask.entity.Task;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepo extends JpaRepository<Task,String> {
    @Query(value = "SELECT * FROM tasks WHERE task_title LIKE %?1% ", nativeQuery=true)
    Page<Task> searchAll(String searchText, Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM tasks WHERE project_id = :projectId", nativeQuery = true)
    void deleteTasksByProjectId(@Param("projectId") String projectId);
}
