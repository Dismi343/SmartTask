package com.example.SmartTask.repository;

import com.example.SmartTask.entity.Project;
import com.example.SmartTask.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepo extends JpaRepository<Project,String> {
    @Query(value = "SELECT * FROM projects WHERE project_name LIKE %?1% ", nativeQuery=true)
    Page<Project> searchAll(String searchText, Pageable pageable);
}
