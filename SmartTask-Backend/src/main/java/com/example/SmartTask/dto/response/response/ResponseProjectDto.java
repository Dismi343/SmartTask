package com.example.SmartTask.dto.response.response;

import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseProjectDto {
    private String project_id;
    private String projectName;
    private String description;
    private String startDate;
    private String endDate;

    private User user;
    private List<Task> taskList;
}
