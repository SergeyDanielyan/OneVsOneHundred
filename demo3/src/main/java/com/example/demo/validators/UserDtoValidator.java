package com.example.demo.validators;

import com.example.demo.DTO.UserDto;

import java.util.regex.Pattern;

public class UserDtoValidator {
    private static boolean isEmailValid(String email) {
        if (email.isEmpty()) {
            return false;
        }
        final String EMAIL_REGEX = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$";
        return Pattern.compile(EMAIL_REGEX).matcher(email).matches();
    }

    private static boolean isUsernameValid(String nickname) {
        final String NICKNAME_REGEX = "^[a-zA-Z0-9_-]{3,16}$";
        return Pattern.compile(NICKNAME_REGEX).matcher(nickname).matches();
    }

    private static boolean isPasswordValid(String password) {
        final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{7,}$";
        return Pattern.compile(PASSWORD_REGEX).matcher(password).matches();
    }

    public static boolean isUserDtoValid(UserDto userDto) {
        return isEmailValid(userDto.getEmail()) && isUsernameValid(userDto.getUsername())
                && isPasswordValid(userDto.getPassword());
    }
}
