package com.example.SmartTask.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="users")
public class User {
    @Id
    @Column(name = "userId", nullable = false)
    private String user_id;
    @Column(name="userName",length=45, nullable = false)
    private String username;
    @Column(name="email",length=100, nullable = false)
    private String email;
    @Column(name = "password", length = 45, nullable = false)
    private String password;
    @Column(name="role",length=45, nullable = false)
    private String role;

    @OneToMany(mappedBy = "user" )
    private List<Project> tasks;
}
