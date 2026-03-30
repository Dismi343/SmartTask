package com.example.SmartTask.service;

import com.example.SmartTask.dto.request.RequestUserDto;
import com.example.SmartTask.dto.response.paginate.PaginateUserDto;
import com.example.SmartTask.dto.response.response.ResponseUserDto;

public interface UserService {
    public void saveUser(RequestUserDto dto);
    public void deleteUser(String user_id);
    public void updateUser(RequestUserDto dto,String user_id);
    public ResponseUserDto findUserById(String user_id);
    public PaginateUserDto searchAllUser(String searchText,int page, int size);
    public String userLogin(String email, String password);
    public ResponseUserDto findByEmail(String email);
}
