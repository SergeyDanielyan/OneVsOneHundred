package com.example.demo.services;

import com.example.demo.models.GameRoom;
import com.example.demo.models.User;
import com.example.demo.repositories.GameRoomRepository;
import com.example.demo.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class GameRoomService {
    //private final Lock lock = new ReentrantLock();
    private final GameRoomRepository gameRoomRepository;
    private final UserRepository userRepository;

    public GameRoom createRoom(User user) {
        GameRoom gameRoom = new GameRoom();
        user.setGameRoom(gameRoom);
        gameRoom.getUsers().add(user);
        gameRoom = gameRoomRepository.save(gameRoom);
        log.info("Created a room {} by player {}", gameRoom, user);
        return gameRoom;
    }

    public GameRoom putIntoRoom(User player) {
        var gameRoom = gameRoomRepository.findFirstByFilled(false);
        gameRoom.addPlayer(player);
        log.info("Putted a player {} into room {}", player, gameRoom);
        return gameRoomRepository.save(gameRoom);
    }

    public boolean answer(GameRoom gameRoom, User user, String result) {
        var playersResults = gameRoom.getPlayersResult().split(":");
        int ind = -1;
        for (int i = 0; i < GameRoom.FULL_NUMBER; ++i) {
            if (Objects.equals(gameRoom.getUsers().get(i).getId(), user.getId())) {
                ind = i;
                break;
            }
        }
        playersResults[ind] = result;
        gameRoom.setPlayersResult(String.join(":", playersResults));
        gameRoom.setAllAnswers(gameRoom.getAllAnswers() + 1);
        gameRoom = gameRoomRepository.save(gameRoom);
        return gameRoom.isFinished();
    }

    public GameRoom getGameRoomById(int id) {
        return gameRoomRepository.findById(id).get();
    }

    //@Transactional
    public boolean addConnectedUser(int roomId) {

        gameRoomRepository.incrementConnectedNumber(roomId);

        GameRoom gameRoom = gameRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Game room not found"));

        return gameRoom.getConnectedNumber() >= GameRoom.FULL_NUMBER;

//        //lock.lock();
//        boolean res;
//        synchronized (String.valueOf(roomId).intern()) {
//            // Используем getOne или findById с проверкой наличия
//            var gameRoom = gameRoomRepository.findById(roomId)
//                    .orElseThrow(() -> new RuntimeException("Game room not found"));
//
//            // Атомарно увеличиваем счетчик
//            gameRoom.setConnectedNumber(gameRoom.getConnectedNumber() + 1);
//            gameRoom = gameRoomRepository.save(gameRoom);
//
//            res = gameRoom.getConnectedNumber() >= GameRoom.FULL_NUMBER;
//        }
//        return res;

    }

    public int getUserIdByRoomAndEmail(int roomId, String email) {
        GameRoom gameRoom = getGameRoomById(roomId);
        var users = gameRoom.getUsers();
        for (int i = 0; i < users.size(); ++i) {
            if (Objects.equals(users.get(i).getEmail(), email)) {
                return i;
            }
        }
        return -1;
    }

    public GameRoom finishRound(int roomId) {
        return finishRound(getGameRoomById(roomId));
    }

    public GameRoom finishRound(GameRoom gameRoom) {
        var playersResult = gameRoom.getPlayersResult().split(":");
        for (int i = 0; i < playersResult.length; ++i) {
            if (Objects.equals(playersResult[i], "red") || Objects.equals(playersResult[i], "black")) {
                if (Objects.equals(playersResult[i], "red")) {
                    gameRoom.setCurrentParticipants(gameRoom.getCurrentParticipants() - 1);
                }
                playersResult[i] = "black";
            } else {
                playersResult[i] = "yellow";
            }
        }
        gameRoom.setPlayersResult(String.join(":", playersResult));
        return gameRoomRepository.save(gameRoom);
    }

    public GameRoom refreshGameRoom(int roomId) {
        var gameRoom = getGameRoomById(roomId);

        gameRoom.setAllAnswers(0);
        return gameRoomRepository.save(finishRound(gameRoom));
    }

    public GameRoom handleBeingFullyLost(GameRoom gameRoom) {
        gameRoom.handleBeingFullyLost();
        return gameRoomRepository.save(gameRoom);
    }
}
