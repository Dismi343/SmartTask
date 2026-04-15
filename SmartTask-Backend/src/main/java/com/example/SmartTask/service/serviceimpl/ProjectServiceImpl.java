package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.dto.request.RequestProjectDto;
import com.example.SmartTask.dto.request.RequestTaskDto;
import com.example.SmartTask.dto.response.paginate.PaginateProjectDto;
import com.example.SmartTask.dto.response.paginate.PaginateTaskDto;
import com.example.SmartTask.dto.response.response.ResponseProjectDto;
import com.example.SmartTask.dto.response.response.ResponseTaskDto;
import com.example.SmartTask.entity.Project;
import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import com.example.SmartTask.exception.EntryNotFoundException;
import com.example.SmartTask.repository.ProjectRepo;
import com.example.SmartTask.repository.TaskRepo;
import com.example.SmartTask.repository.UserRepo;
import com.example.SmartTask.service.JwtService;
import com.example.SmartTask.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;
    private final TaskRepo taskRepo;

    @Override
    public void save(RequestProjectDto dto) {
            projectRepo.save(toProject(dto));
    }

    @Override
    public void delete(String id) {
        taskRepo.deleteTasksByProjectId(id);
        projectRepo.deleteById(id);
    }

    @Override
    public void update(RequestProjectDto dto, String id) {
        Project project = projectRepo.findById(id).orElseThrow(()->new EntryNotFoundException("Task not found"));

        project.setProjectName(dto.getProjectName());
        project.setDescription(dto.getDescription());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        projectRepo.save(project);

    }

    @Override
    public ResponseProjectDto findById(String id) {

        Project project = projectRepo.findById(id).orElseThrow(()->new EntryNotFoundException("Task not found"));
        return toResponseProject(project);
    }

    @Override
    public PaginateProjectDto searchAll(String searchText, int page, int size) {

        Page<Project> taskList=projectRepo.searchAll(searchText, PageRequest.of(page, size));
        return PaginateProjectDto.builder()
                .dataList(
                        taskList.stream().map(e -> toResponseProject(e)).toList()
                )
                .count(taskList.getTotalElements())
                .build();
    }

    @Override
    public PaginateProjectDto searchAllByUser(int page, int size,String user_id) {
        Page<Project> projectLists=projectRepo.findProjectsByUserId(user_id,PageRequest.of(page, size));
        return PaginateProjectDto.builder()
                .dataList(
                        projectLists.stream().map(e -> toResponseProject(e)).toList()
                )
                .count(projectLists.getTotalElements())
                .build();
    }

    //----------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------

    private Project toProject(RequestProjectDto project){
        if(project==null) return null;
        List<User> users=userRepo.findAllById(project.getUsers()).stream().toList();
        return Project.builder()
                .project_id(UUID.randomUUID().toString())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .users(users)
                .build();
    }

    private ResponseProjectDto toResponseProject(Project project){
        if(project==null) return null;
        return ResponseProjectDto.builder()
                .project_id(project.getProject_id())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(String.valueOf(project.getStartDate()))
                .endDate(String.valueOf(project.getEndDate()))
                .userList(project.getUsers())
                .taskList(project.getTasks())
                .build();
    }
}
