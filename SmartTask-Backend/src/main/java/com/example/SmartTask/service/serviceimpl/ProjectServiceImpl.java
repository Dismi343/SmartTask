package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.dto.request.RequestProjectDto;
import com.example.SmartTask.dto.response.paginate.PaginateProjectDto;
import com.example.SmartTask.dto.response.response.ResponseProjectDto;
import com.example.SmartTask.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    @Override
    public void save(RequestProjectDto dto) {

    }

    @Override
    public void delete(String id) {

    }

    @Override
    public void update(RequestProjectDto dto, String id) {

    }

    @Override
    public ResponseProjectDto findById(String id) {
        return null;
    }

    @Override
    public PaginateProjectDto searchAll(String searchText, int page, int size) {
        return null;
    }
}
