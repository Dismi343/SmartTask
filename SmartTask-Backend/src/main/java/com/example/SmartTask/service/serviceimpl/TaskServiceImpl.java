package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.dto.request.RequestTaskDto;
import com.example.SmartTask.dto.response.paginate.PaginateTaskDto;
import com.example.SmartTask.dto.response.response.ResponseTaskDto;
import com.example.SmartTask.dto.response.response.ResponseUserDto;
import com.example.SmartTask.entity.Project;
import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import com.example.SmartTask.exception.EntryNotFoundException;
import com.example.SmartTask.repository.ProjectRepo;
import com.example.SmartTask.repository.TaskRepo;
import com.example.SmartTask.repository.UserRepo;
import com.example.SmartTask.service.JwtService;
import com.example.SmartTask.service.ProjectService;
import com.example.SmartTask.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepo taskRepo;
    private final UserRepo userRepo;
    private final JwtService jwtService;
    private final ProjectRepo projectRepo;
    @Override
    public void save(RequestTaskDto dto) {
            taskRepo.save(toTask(dto));
    }

    @Override
    public void delete(String id) {
            taskRepo.deleteById(id);
    }

    @Override
    public void update(RequestTaskDto dto, String id) {
            Task task = taskRepo.findById(id).orElseThrow(()->new EntryNotFoundException("Task not found"));
            task.setTaskTitle(dto.getTaskTitle());
            task.setStatus(dto.getStatus());
            task.setPriority(dto.getPriority());
            task.setDeadline(dto.getDeadline());
            taskRepo.save(task);
    }

    @Override
    public ResponseTaskDto findById(String id) {
        Task task = taskRepo.findById(id).orElseThrow(()->new EntryNotFoundException("Task not found"));
        return toResponseTask(task);
    }

    @Override
    public PaginateTaskDto searchAll(String searchText, int page, int size) {
        Page<Task> taskList=taskRepo.searchAll(searchText, PageRequest.of(page, size));
        return PaginateTaskDto.builder()
                .dataList(
                        taskList.stream().map(e -> toResponseTask(e)).toList()
                )
                .count(taskList.getTotalElements())
                .build();
    }

    private Task toTask(RequestTaskDto task){
            if(task==null) return null;
        String userEmail=jwtService.getActiveUser();
        User user= userRepo.findByEmail(userEmail).orElseThrow(() -> new EntryNotFoundException("User not found"));
        if(user.getRole().equalsIgnoreCase("Project Manager") || user.getRole().equalsIgnoreCase("PM")){
            user=userRepo.findById(task.getUser_id()).orElseThrow(() -> new EntryNotFoundException("User not found"));
        }
        Project project = projectRepo.findById(task.getProject_id()).orElseThrow(() -> new EntryNotFoundException("project not found"));
        return Task.builder()
                    .task_id(UUID.randomUUID().toString())
                    .taskTitle(task.getTaskTitle())
                    .status(task.getStatus())
                    .priority(task.getPriority())
                    .deadline(task.getDeadline())
                    .project(project)
                    .user(user)
                    .build();
    }

    private ResponseTaskDto toResponseTask(Task task){
        if(task==null) return null;

        return ResponseTaskDto.builder()
                .task_id(task.getTask_id())
                .taskTitle(task.getTaskTitle())
                .status(String.valueOf(task.getStatus()))
                .priority(String.valueOf(task.getPriority()))
                .deadline(String.valueOf(task.getDeadline()))
                .projectId(task.getProject().getProject_id())
                .user(task.getUser())
                .build();
    }
}
