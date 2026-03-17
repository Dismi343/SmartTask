package com.example.SmartTask.util;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StandardResponseDto {
    private String message;
    private int code;
    private Object data;
}
