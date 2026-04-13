package com.example.SmartTask.dto.response.response;

import com.example.SmartTask.entity.Project;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseUserDto {
    private String user_id;
    private String userName;
    private String email;
    private String password;
    private String role;
//    private List<Project> projectlist;
}
