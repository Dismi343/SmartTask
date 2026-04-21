package com.example.SmartTask.dto.request;

import com.example.SmartTask.enums.TaskEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestTaskDto {
    private String taskTitle;
    private String description;
    private TaskEnum.Status status;
    private TaskEnum.Priority priority;
    private LocalDateTime deadline;
    private String project_id;
    private String user_id;
}
