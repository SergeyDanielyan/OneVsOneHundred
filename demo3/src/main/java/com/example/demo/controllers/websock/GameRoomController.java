package com.example.demo.controllers.websock;

import com.example.demo.models.GameRoom;
import com.example.demo.models.User;
import com.example.demo.repositories.GameRoomRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.GameRoomService;
import com.example.demo.services.TaskService;
import com.example.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@Slf4j
@RequiredArgsConstructor
public class GameRoomController {
    private final GameRoomService gameRoomService;
    private final UserService userService;
    private final TaskService taskService;

    private final UserRepository userRepository;

    @MessageMapping("/join-room")
    @SendTo("/topic/join-room")
    public String joinRoom(String message) {
        User user = null;
        try {
            user = userService.getUserByToken(message);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        GameRoom gameRoom = gameRoomService.putIntoRoom(user);
        if (!gameRoom.isFilled()) {
            return "join:" + user.getEmail() + ":" + gameRoom.getId();
        }
        var hero = userRepository.findById(gameRoom.getUsers().get(gameRoom.getHero()).getId()).get();
        return "join-start:" + user.getEmail() + ":" + gameRoom.getId() + ":" + hero.getEmail();
    }

    @MessageMapping("/get-answer")
    @SendTo("/topic/answers")
    public String getAnswer(String message) {
        log.info("got query {}", message);
        var splitted = message.split(":");
        if (Objects.equals(splitted[0], "answer")) {
            var roomId = splitted[1];
            var token = splitted[2];
            var result = splitted[3];
            User user = null;
            try {
                user = userService.getUserByToken(token);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
            var gameRoom = gameRoomService.getGameRoomById(Integer.parseInt(roomId));
            var finished = gameRoomService.answer(gameRoom, user, result);
            if (finished) {
                gameRoom = gameRoomService.handleBeingFullyLost(gameRoom);
                var gameRoomArr = gameRoom.getPlayersResult().split(":");
                var heroCouldWin = true;
                for (int i = 0; i < GameRoom.FULL_NUMBER; ++i) {
                    if (i != gameRoom.getHero() && !(gameRoomArr[i].equals("black") || gameRoomArr[i].equals("red"))) {
                        heroCouldWin = false;
                        break;
                    }
                }

                if (gameRoom.getPlayersResult().split(":")[gameRoom.getHero()].equals("black") || gameRoom.getPlayersResult().split(":")[gameRoom.getHero()].equals("red")) {
                    return "hero-lost:" + splitted[1] + ":" + gameRoom.getPlayersResult();
                } else if (heroCouldWin) {
                    return "hero-won:" + splitted[1] + ":" + gameRoom.getPlayersResult();
                } else {
                    return "finished:" + gameRoom.getPlayersResult();
                }
            }
            return "change:" + gameRoom.getPlayersResult();
        } else if (Objects.equals(splitted[0], "task")) {
            var roomId = splitted[1];
            var task = taskService.getRandomTask();
            var gameRoom = gameRoomService.refreshGameRoom(Integer.parseInt(roomId));
            return "task:" + roomId + ":" + task.getQuestion() + ":" + task.getCorrectAnswer() + ":" + task.getFirstWrongAnswer() + ":" + task.getSecondWrongAnswer() + ":" + gameRoom.getPlayersResult();
        } else if (Objects.equals(splitted[0], "connect")) {
            var roomId = splitted[1];
            var full = gameRoomService.addConnectedUser(Integer.parseInt(roomId));
            if (full) {
                return "full:" + roomId;
            }
        } else if (Objects.equals(splitted[0], "finish")) {
            var roomId = splitted[1];

            gameRoomService.finishRound(Integer.parseInt(roomId));

            return "hero-left:" + splitted[1];
        }
        return "unknown";
    }
}
