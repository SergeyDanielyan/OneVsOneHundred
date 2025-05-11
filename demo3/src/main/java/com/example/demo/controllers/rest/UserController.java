package com.example.demo.controllers.rest;

import com.example.demo.DTO.AuthDto;
import com.example.demo.DTO.UserDto;
import com.example.demo.models.User;
import com.example.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@Tag(name = "users_methods")
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

//    @Operation(
//            summary = "пробует сохранить нового пользователя в базе данных"
//    )
    @PostMapping("/registr")
    public ResponseEntity<String> addUser(@RequestBody UserDto userDto) {
        try {
            if (!userService.createUser(userDto)) {
                throw new Exception("Couldn't create such user");
            }
            return ResponseEntity.ok("User is registered");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

//    @Operation(
//            summary = "пробует авторизовать пользователя"
//    )
    @PostMapping("/auth")
    public ResponseEntity<String> auth(@RequestBody AuthDto authDto) {
        try {
            String myToken = userService.authUser(authDto.getEmail(), authDto.getPassword());
            return ResponseEntity.ok(myToken);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("name")
    public ResponseEntity<String> getUserNameByToken(@RequestParam String token) {
        try {
            User user = userService.getUserByToken(token);
            return ResponseEntity.ok(user.getUsername());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<String> getUserInfoByToken(@RequestParam String token) {
        try {
            User user = userService.getUserByToken(token);
            return ResponseEntity.ok(user.toString());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}