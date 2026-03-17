package com.example.SmartTask.api;

import com.example.SmartTask.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/projects")
public class ProjectController {
private final ProjectService projectService;

    public void create(){}
    public void findById(){}
    public void updateById(){}
    public void deleteById(){}
    public void searchAll(){}
}
