package com.example.demo.controllers.rest;

import com.example.demo.models.Task;
import com.example.demo.services.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("api/one-player")
@RequiredArgsConstructor
public class OnePlayerController {
    private final TaskService taskService;

    @GetMapping("random-task")
    public ResponseEntity<Task> getRandomTask() {
        return ResponseEntity.ok(taskService.getRandomTask());
    }
}
