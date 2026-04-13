package com.example.SmartTask.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="projects")
public class Project {
    @Id
    @Column(name="project_id", nullable = false)
    private String project_id;
    @Column(name="project_name",length=45, nullable = false)
    private String projectName;
    @Column(name="description",length=255, nullable = false)
    private String description;
    @Column(name="start_date",length=45, nullable = false)
    private LocalDate startDate;
    @Column(name="end_date",length=45, nullable = false)
    private LocalDate endDate;


    @OneToMany(mappedBy = "project")
    private List<Task> tasks;

    @ManyToMany
    @JoinTable(
            name = "project_users", // join table name
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users;
}
