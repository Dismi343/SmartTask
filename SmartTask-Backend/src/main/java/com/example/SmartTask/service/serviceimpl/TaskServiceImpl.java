package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.dto.request.RequestTaskDto;
import com.example.SmartTask.dto.response.paginate.PaginateTaskDto;
import com.example.SmartTask.dto.response.response.ResponseTaskDto;
import com.example.SmartTask.dto.response.response.ResponseUserDto;
import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import com.example.SmartTask.exception.EntryNotFoundException;
import com.example.SmartTask.repository.TaskRepo;
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
    private TaskRepo taskRepo;
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
            return Task.builder()
                    .task_id(UUID.randomUUID().toString())
                    .taskTitle(task.getTaskTitle())
                    .status(task.getStatus())
                    .priority(task.getPriority())
                    .deadline(task.getDeadline())
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
                .build();
    }
}
