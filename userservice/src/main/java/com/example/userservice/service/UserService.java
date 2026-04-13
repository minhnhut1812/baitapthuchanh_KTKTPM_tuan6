package com.example.userservice.service;

import com.example.userservice.dto.LoginRequest;
import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.security.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    public User register(RegisterRequest req) {

        if (repo.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("User exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(req.getPassword());
        user.setRole("USER");

        return repo.save(user);
    }

    public String login(LoginRequest req) {

        User user = repo.findByUsername(req.getUsername())
            .orElseThrow(() -> 
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
            );

        if (!user.getPassword().equals(req.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
        }

        return jwtUtil.generateToken(user.getUsername());
    }

    public List<User> getAll() {
        return repo.findAll();
    }
}