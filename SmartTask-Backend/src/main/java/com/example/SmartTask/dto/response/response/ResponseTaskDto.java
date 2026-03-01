package com.example.SmartTask.dto.response.response;


import com.example.SmartTask.entity.Project;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseTaskDto {
    private String task_id;
    private String taskTitle;
    private String status;
    private String priority;
    private String deadline;
    private Project project;
}
