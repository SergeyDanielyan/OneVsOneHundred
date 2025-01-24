package com.example.demo.DTO;

import lombok.Data;

@Data
public class AuthDto {
    private String email;
    private String password;

    @Override
    public String toString() {
        return "User\n" + email + "\n" + password + "\n";
    }
}
