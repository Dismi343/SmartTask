package com.example.SmartTask.api;

import com.example.SmartTask.dto.request.RequestUserDto;
import com.example.SmartTask.service.UserService;
import com.example.SmartTask.util.StandardResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")
public class UserController {
private final UserService userService;
@PostMapping("/create-user")
public ResponseEntity<StandardResponseDto> create(
        @RequestBody RequestUserDto dto
        ){
    userService.saveUser(dto);
    return new ResponseEntity<>(
            new StandardResponseDto(
                    "Successfully saved",201,null
            ), HttpStatus.CREATED
    );
}

@GetMapping("/find-user/{id}")
public ResponseEntity<StandardResponseDto> findById(
        @PathVariable String id
){
    return new ResponseEntity<>(
            new StandardResponseDto(
                    "User found",200,userService.findUserById(id)
            ), HttpStatus.OK
    );
}
@PostMapping("/update-user/{id}")
public ResponseEntity<StandardResponseDto> updateById(
        @PathVariable String id,
        @RequestBody RequestUserDto dto
){
    userService.updateUser(dto,id);
    return new ResponseEntity<>(
            new StandardResponseDto(
                    "Successfully saved",201,null
            ), HttpStatus.CREATED
    );
}
@DeleteMapping("/delete-user/{id}")
public ResponseEntity<StandardResponseDto> deleteById(
        @PathVariable String id
){
    userService.deleteUser(id);
    return new ResponseEntity<>(
            new StandardResponseDto(
                    "Successfully deleted",204,null
            ), HttpStatus.NO_CONTENT
    );
}

@GetMapping("/search-users")
public ResponseEntity<StandardResponseDto> searchAll(
        @RequestParam String searchText,
        @RequestParam int page,
        @RequestParam int size
){
    return new ResponseEntity<>(
            new StandardResponseDto(
                    "User List",200,userService.searchAllUser(searchText,page,size)
            ), HttpStatus.OK
    );
}

}
