package com.example.SmartTask.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name="users")
public class User {
    @Id
    @Column(name = "user_id", nullable = false)
    private String user_id;
    @Column(name="user_name",length=45, nullable = false)
    private String username;
    @Column(name="email",length=100, nullable = false)
    private String email;
    @Column(name = "password", length = 256, nullable = false)
    private String password;
    @Column(name="role",length=45, nullable = false)
    private String role;

    @OneToMany(mappedBy = "user" )
    private List<Project> projects;
}
