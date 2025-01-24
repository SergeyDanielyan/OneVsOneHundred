package com.example.demo.DTO;

import lombok.Data;

@Data
public class UserDto {
    private String email;
    private String username;
    private String password;

    @Override
    public String toString() {
        return "User\n" + email + "\n" + username + "\n" + password + "\n";
    }
}