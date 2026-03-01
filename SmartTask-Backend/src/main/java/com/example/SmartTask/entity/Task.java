package com.example.SmartTask.entity;

import com.example.SmartTask.enums.TaskEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.apachecommons.CommonsLog;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="tasks")
public class Task {
    @Id
    @Column(name="taskId", nullable = false)
    private String task_id;
    @Column(name="taskTitle",length=45, nullable = false)
    private String taskTitle;
    @Column(name="status", nullable = false)
    private Enum<TaskEnum.Status> status;
    @Column(name="priority", nullable = false)
    private Enum<TaskEnum.Priority> priority;
    @Column(name="deadline", nullable = false)
    private LocalDateTime deadline;

    @ManyToOne
    @JoinColumn(name= "projectId", nullable = false)
    private Project project;
}
