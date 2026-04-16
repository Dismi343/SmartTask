package com.example.SmartTask.dto.response.response;


import com.example.SmartTask.entity.Project;
import com.example.SmartTask.entity.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseTaskDto {
    private String task_id;
    private String taskTitle;
    private String description;
    private String status;
    private String priority;
    private String deadline;
    private String projectId;
    private User user;

}
