package com.example.SmartTask.dto.response.response;

import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseProjectDto {
    private String project_id;
    private String projectName;
    private String description;
    private String startDate;
    private String endDate;

    private User user;
    private List<Task> taskList;
}
