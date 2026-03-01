package com.example.SmartTask.service;

import com.example.SmartTask.dto.request.RequestProjectDto;
import com.example.SmartTask.dto.response.paginate.PaginateProjectDto;
import com.example.SmartTask.dto.response.response.ResponseProjectDto;

public interface ProjectService {
    public void save(RequestProjectDto dto);
    public void delete(String id);
    public void update(RequestProjectDto dto,String id);
    public ResponseProjectDto findById(String id);
    public PaginateProjectDto searchAll(String searchText, int page, int size);
}
