package com.example.SmartTask.service.serviceimpl;

import com.example.SmartTask.dto.request.RequestUserDto;
import com.example.SmartTask.dto.response.paginate.PaginateTaskDto;
import com.example.SmartTask.dto.response.paginate.PaginateUserDto;
import com.example.SmartTask.dto.response.response.ResponseUserDto;
import com.example.SmartTask.entity.Task;
import com.example.SmartTask.entity.User;
import com.example.SmartTask.exception.EntryNotFoundException;
import com.example.SmartTask.repository.UserRepo;
import com.example.SmartTask.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.PasswordAuthentication;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;

    @Override
    public void saveUser(RequestUserDto dto) {
        userRepo.save(toUser(dto));
    }

    @Override
    public void deleteUser(String user_id) {
        userRepo.deleteById(user_id);
    }

    @Override
    public void updateUser(RequestUserDto dto, String user_id) {
        User user=userRepo.findById(user_id).orElseThrow(()->new EntryNotFoundException("No Customer"));
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        if(dto.getPassword()!=null){
            user.setPassword(new BCryptPasswordEncoder().encode(dto.getPassword()));
        }
        userRepo.save(user);
    }

    @Override
    public ResponseUserDto findUserById(String user_id) {
           return toResponseUserDto(userRepo.findById(user_id).orElseThrow(()->new EntryNotFoundException("No Customer")));
    }

    @Override
    public PaginateUserDto searchAllUser(String searchText, int page, int size) {
        Page<User> userList=userRepo.searchAll(searchText, PageRequest.of(page, size));
        return PaginateUserDto.builder()
                .dataList(
                        userList.stream().map(e -> toResponseUserDto(e)).toList()
                )
                .count(userList.getTotalElements())
                .build();
    }

    private User toUser(RequestUserDto dto){
        if(dto==null) return null;
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(16);
        String rawPassword = dto.getPassword();
        String hashedPassword= passwordEncoder.encode(rawPassword);
        return User.builder()
                .user_id(UUID.randomUUID().toString())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(hashedPassword)
                .role(dto.getRole())
                .build();
    }

    private ResponseUserDto toResponseUserDto(User user){
        if(user==null) return null;
        return ResponseUserDto.builder()
                .user_id(user.getUser_id())
                .userName(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .build();
    }
}
