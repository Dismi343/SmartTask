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
    private Enum<TaskEnum.Status> status;
    private Enum<TaskEnum.Priority> priority;
    private LocalDateTime deadline;
}
