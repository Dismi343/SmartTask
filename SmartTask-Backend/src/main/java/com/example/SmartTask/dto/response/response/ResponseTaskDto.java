package com.example.SmartTask.dto.response.response;


import com.example.SmartTask.entity.Project;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseTaskDto {
    private String task_id;
    private String taskTitle;
    private String status;
    private String priority;
    private String deadline;
    private Project project;
}
