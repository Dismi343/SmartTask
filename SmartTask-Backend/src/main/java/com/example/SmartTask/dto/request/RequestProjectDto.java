package com.example.SmartTask.dto.request;


import com.example.SmartTask.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestProjectDto {
    private String projectName;
    private String  description;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> users;
}

