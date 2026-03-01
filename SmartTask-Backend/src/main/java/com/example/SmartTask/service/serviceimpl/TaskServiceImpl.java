package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.dto.request.RequestTaskDto;
import com.example.SmartTask.dto.response.paginate.PaginateTaskDto;
import com.example.SmartTask.dto.response.response.ResponseTaskDto;
import com.example.SmartTask.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    @Override
    public void save(RequestTaskDto dto) {

    }

    @Override
    public void delete(String id) {

    }

    @Override
    public void update(RequestTaskDto dto, String id) {

    }

    @Override
    public ResponseTaskDto findById(String id) {
        return null;
    }

    @Override
    public PaginateTaskDto searchAll(String searchText, int page, int size) {
        return null;
    }
}
