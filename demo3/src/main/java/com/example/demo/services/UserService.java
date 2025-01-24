package com.example.demo.services;

import com.example.demo.DTO.UserDto;
import com.example.demo.models.Session;
import com.example.demo.models.User;
import com.example.demo.repositories.SessionRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.validators.UserDtoValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    enum MyRole implements GrantedAuthority {
        USER;

        @Override
        public String getAuthority() {
            return name();
        }
    }

    public boolean createUser(UserDto userDto) {
        if (!UserDtoValidator.isUserDtoValid(userDto)) {
            log.info("Email, nickname, password of user = {} are not valid", userDto);
            return false;
        }
        if (userRepository.findByEmail(userDto.getEmail()) != null) {
            log.info("User with email = {} already exists", userDto.getEmail());
            return false;
        }
        if (userRepository.findByUsername(userDto.getUsername()) != null) {
            log.info("User with nickname = {} already exists", userDto.getUsername());
            return false;
        }
        log.info("Saved new user = {}", userRepository.save(User.builder()
                .email(userDto.getEmail())
                .username(userDto.getUsername())
                .password(userDto.getPassword())
                .build()));
        return true;
    }

    public String authUser(String email, String password) throws Exception {
        User myUser = userRepository.findByEmail(email);
        if (myUser == null) {
            log.info("There is no user with email = {}", email);
            throw new Exception("There is no such user");
        }
        if (!myUser.getPassword().equals(password)) {
            log.info("The password = {} is wrong", password);
            throw new Exception("There is no such user");
        }
        String myToken = jwtService.generateToken(myUser);
        Session session = Session.builder()
                .user(myUser)
                .token(myToken)
                .expired(LocalDateTime.now().plusHours(1))
                .build();
        sessionRepository.save(session);
        return myToken;
    }

    public UserDetails loadUserByEmail(String email) {
        if (email == null) {
            throw new UsernameNotFoundException("Wrong email");
        }
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("There is no user with such email");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(MyRole.USER)
        );
    }

    public User getUserByToken(String token) throws Exception {
        Session session = sessionRepository.findByToken(token);
        if (session == null) {
            throw new IllegalArgumentException("Wrong token");
        }
        return session.getUser();
    }
}