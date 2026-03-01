package com.example.SmartTask.dto.response.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseUserDto {
    private String user_id;
    private String userName;
    private String email;
    private String password;
    private String role;
}
