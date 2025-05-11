package com.example.demo.services;

import com.example.demo.models.Task;
import com.example.demo.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public Task getRandomTask() {
        Task task = taskRepository.findRandom();
        return task;
    }
}
