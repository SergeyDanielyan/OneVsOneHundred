package com.example.demo.models;

import jakarta.persistence.*;
import lombok.*;

import java.security.SecureRandom;
import java.util.*;

@Data
@Entity
@Table(name = "game_rooms")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = "users")
public class GameRoom {
    public static final int FULL_NUMBER = 3;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    //@Column(name = "players")
    @OneToMany(mappedBy = "gameRoom", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private List<User> users = new ArrayList<>();
    @Column(name = "hero")
    private Integer hero;
    @Column(name = "filled")
    private boolean filled;
    //    @Column(name = "hero_result")
    //private String heroResult;
    @Column(name = "players_result")
    private String playersResult = "yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:" +
            "yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow";
    @Column(name = "previous_players_result")
    private String previousPlayersResult = "yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:" +
            "yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow:yellow";
    @Column(name = "all_answers")
    private int allAnswers;
    @Column(name = "connected_number")
    private int connectedNumber;
    @Column(name = "current_participants")
    private int currentParticipants = FULL_NUMBER;

    public boolean isFinished() {
        return allAnswers >= currentParticipants;
    }

    public void addPlayer(User player) {
        users.add(player);
        player.setGameRoom(this);
        if (users.size() >= FULL_NUMBER) {
            filled = true;
            SecureRandom random = new SecureRandom();
            hero = random.nextInt(FULL_NUMBER);
        }
    }

    private boolean containsCorrect() {
        var playersResults = playersResult.split(":");
        for (int i = 0; i < FULL_NUMBER; ++i) {
            if (playersResults[i].equals("yellow") || playersResults[i].equals("green")) {
                return true;
            }
        }
        return false;
    }

    public void handleBeingFullyLost() {
        if (!containsCorrect()) {
            playersResult = previousPlayersResult;
        }
    }
}
