package com.example.SmartTask.dto.request;

import com.example.SmartTask.enums.TaskEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestTaskDto {
    private String taskTitle;
    private Enum<TaskEnum.Status> status;
    private Enum<TaskEnum.Priority> priority;
    private LocalDate deadline;
}
