package com.example.SmartTask.api;

import com.example.SmartTask.dto.request.RequestProjectDto;
import com.example.SmartTask.entity.Project;
import com.example.SmartTask.service.ProjectService;
import com.example.SmartTask.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/create-project")
    public ResponseEntity<StandardResponseDto> create(
            @RequestBody RequestProjectDto dto
    ){
        projectService.save(dto);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Successfully saved",201,null
                ), HttpStatus.CREATED
        );
    }

    @GetMapping("find-project/{id}")
    public ResponseEntity<StandardResponseDto> findById(
            @PathVariable String id
    ){

        return new ResponseEntity<>(
                new StandardResponseDto(
                        "project found",200,projectService.findById(id)
                ), HttpStatus.OK
        );
    }

    @PutMapping("update-project/{id}")
    public ResponseEntity<StandardResponseDto> updateById(
            @RequestBody RequestProjectDto dto,
            @PathVariable String id
    ){
        projectService.update(dto, id);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Successfully saved",201,null
                ), HttpStatus.CREATED
        );
    }

    @DeleteMapping("/delete-project/{id}")
    public ResponseEntity<StandardResponseDto> deleteById(
            @PathVariable String id
    ){
        projectService.delete(id);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Successfully deleted",204,null
                ), HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/search-projects")
    public ResponseEntity<StandardResponseDto> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "project List",200,projectService.searchAll(searchText,page,size)
                ), HttpStatus.OK
        );
    }

    @GetMapping("/search-projects-by-user/{id}")
    public ResponseEntity<StandardResponseDto> searchByUser(
            @RequestParam int page,
            @RequestParam int size,
            @PathVariable String id
    ){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "project List",200,projectService.searchAllByUser(page,size,id)
                ), HttpStatus.OK
        );
    }
}
