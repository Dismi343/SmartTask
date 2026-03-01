package com.example.SmartTask.repository;

import com.example.SmartTask.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepo extends JpaRepository<Project,String> {

}
