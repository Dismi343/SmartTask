package com.example.SmartTask.dto.response.paginate;

import com.example.SmartTask.dto.response.response.ResponseProjectDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginateProjectDto {
    private long count;
    private List<ResponseProjectDto> dataList;
}
