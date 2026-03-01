package com.example.SmartTask.dto.response.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseUserDto {
    private String user_id;
    private String userName;
    private String email;
    private String password;
    private String role;
}
