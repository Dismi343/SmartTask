package com.example.SmartTask.dto.response.paginate;

import com.example.SmartTask.dto.response.response.ResponseTaskDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginateTaskDto {
    private long count;
    private List<ResponseTaskDto> dataList;
}
