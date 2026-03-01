package com.example.SmartTask.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="projects")
public class Project {
    @Id
    @Column(name="projectId", nullable = false)
    private String project_id;
    @Column(name="projectName",length=45, nullable = false)
    private String projectName;
    @Column(name="description",length=255, nullable = false)
    private String description;
    @Column(name="startDate",length=45, nullable = false)
    private LocalDate startDate;
    @Column(name="endDate",length=45, nullable = false)
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name= "userId", nullable = false)
    private User user;

    @OneToMany(mappedBy = "project")
    private List<Task> tasks;

}
