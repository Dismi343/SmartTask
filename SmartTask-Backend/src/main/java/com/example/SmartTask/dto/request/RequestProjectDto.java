package com.example.SmartTask.dto.request;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestProjectDto {
    private String projectName;
    private String  description;
    private LocalDate startDate;
    private LocalDate endDate;
}

