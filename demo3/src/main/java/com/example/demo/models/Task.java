package com.example.demo.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "tasks")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "question")
    private String question;
    @Column(name = "correct_answer")
    private String correctAnswer;
    @Column(name = "first_wrong_answer")
    private String firstWrongAnswer;
    @Column(name = "second_wrong_answer")
    private String secondWrongAnswer;
}
