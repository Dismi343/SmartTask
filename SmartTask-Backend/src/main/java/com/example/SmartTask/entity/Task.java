package com.example.SmartTask.entity;

import com.example.SmartTask.enums.TaskEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.apachecommons.CommonsLog;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="tasks")
public class Task {
    @Id
    @Column(name="task_id", nullable = false)
    private String task_id;
    @Column(name="task_title",length=45, nullable = false)
    private String taskTitle;
    @Column(name="description", nullable = false)
    private String taskDescription;
    @Column(name="status", nullable = false)
    private Enum<TaskEnum.Status> status;
    @Column(name="priority", nullable = false)
    private Enum<TaskEnum.Priority> priority;
    @Column(name="deadline", nullable = false)
    private LocalDateTime deadline;

    @ManyToOne
    @JoinColumn(name= "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
