package com.example.demo.controllers.rest;

import com.example.demo.models.GameRoom;
import com.example.demo.models.User;
import com.example.demo.services.GameRoomService;
import com.example.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/rest-game")
@Slf4j
@RequiredArgsConstructor
public class RestGameRoomController {
    private final GameRoomService gameRoomService;
    private final UserService userService;

    @PostMapping("create-room")
    public ResponseEntity<Integer> createRoom(@RequestBody String token) {
        User user = null;
        try {
            user = userService.getUserByToken(token);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        GameRoom gameRoom = gameRoomService.createRoom(user);
        return ResponseEntity.ok(gameRoom.getId());
        //messagingTemplate.convertAndSend("/topic/room/" + gameRoom.getId().toString(), "Room created: " + gameRoom.getId());
    }

    @GetMapping("user-id")
    public ResponseEntity<Integer> getUserId(@RequestParam(name = "room") int room,
                                             @RequestParam(name = "email") String email) {
        return ResponseEntity.ok(gameRoomService.getUserIdByRoomAndEmail(room, email));
    }
}
