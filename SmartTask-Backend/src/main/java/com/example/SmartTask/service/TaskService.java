package com.example.SmartTask.service;

import com.example.SmartTask.dto.request.RequestTaskDto;
import com.example.SmartTask.dto.response.paginate.PaginateTaskDto;
import com.example.SmartTask.dto.response.response.ResponseTaskDto;

public interface TaskService {
    public void save(RequestTaskDto dto);
    public void delete(String id);
    public void update(RequestTaskDto dto,String id);
    public ResponseTaskDto findById(String id);
    public PaginateTaskDto searchAll(String searchText, int page, int size);
}
