package com.example.demo.repositories;

import com.example.demo.models.GameRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRoomRepository extends JpaRepository<GameRoom, Integer> {
    GameRoom findFirstByFilled(boolean filled);

    @Modifying
    @Query("UPDATE GameRoom gr SET gr.connectedNumber = gr.connectedNumber + 1 WHERE gr.id = :roomId")
    void incrementConnectedNumber(@Param("roomId") int roomId);
}
