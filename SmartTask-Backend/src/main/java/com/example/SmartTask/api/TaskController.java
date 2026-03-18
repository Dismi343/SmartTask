package com.example.SmartTask.api;


import com.example.SmartTask.dto.request.RequestTaskDto;
import com.example.SmartTask.service.TaskService;
import com.example.SmartTask.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/tasks")
public class TaskController {
private final TaskService taskService;

    @PostMapping("/create-task")
    public ResponseEntity<StandardResponseDto> create(
            @RequestBody RequestTaskDto dto
            ){
        taskService.save(dto);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Successfully saved",201,null
                ), HttpStatus.CREATED
        );
    }

    @GetMapping("find-task/{id}")
    public ResponseEntity<StandardResponseDto> findById(
            @PathVariable String id
    ){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "project found",200,taskService.findById(id)
                ), HttpStatus.OK
        );
    }

    @PutMapping("/update-task/{id}")
    public ResponseEntity<StandardResponseDto> updateById(
            @PathVariable String id,
            @RequestBody RequestTaskDto dto
    ){
        taskService.update(dto,id);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Successfully saved",201,null
                ), HttpStatus.CREATED
        );
    }

    @DeleteMapping("delete-task/{id}")
    public ResponseEntity<StandardResponseDto> deleteById(
            @PathVariable String id
    ){
        taskService.delete(id);
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Successfully deleted",204,null
                ), HttpStatus.NO_CONTENT
        );
    }
    @GetMapping("/search-tasks")
    public ResponseEntity<StandardResponseDto> searchAll(
            @RequestParam String searchText,
            @RequestParam int page,
            @RequestParam int size
    ){
        return new ResponseEntity<>(
                new StandardResponseDto(
                        "Tasks List",200,taskService.searchAll(searchText,page,size)
                ), HttpStatus.OK
        );
    }
}
