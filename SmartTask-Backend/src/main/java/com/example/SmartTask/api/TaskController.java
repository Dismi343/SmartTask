package com.example.SmartTask.api;


import com.example.SmartTask.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tasks")
public class TaskController {
private final TaskService taskService;
    public void create(){}
    public void findById(){}
    public void updateById(){}
    public void deleteById(){}
    public void searchAll(){}
}
