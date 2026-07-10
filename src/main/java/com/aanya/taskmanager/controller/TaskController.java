package com.aanya.taskmanager.controller;

import com.aanya.taskmanager.model.Task;
import com.aanya.taskmanager.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id).orElseThrow();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {

        task.setCompleted(false);
        task.setCompletedDate(null);

        // Default values
        task.setEditedBy("Aanya");
        task.setCompletedBy("");
        task.setSharedView("My Tasks");
        task.setAccessType("Edit");

        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,
                           @RequestBody Task updatedTask) {

        Task task = taskRepository.findById(id).orElseThrow();

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());

        task.setSharedView(updatedTask.getSharedView());
        task.setAccessType(updatedTask.getAccessType());

        // Every update stores who edited it
        task.setEditedBy("Aanya");

        // Complete Task
        if (updatedTask.isCompleted() && !task.isCompleted()) {

            task.setCompleted(true);

            task.setCompletedDate(LocalDate.now().toString());

            task.setCompletedBy("Aanya");
        }

        // Undo
        else if (!updatedTask.isCompleted()) {

            task.setCompleted(false);

            task.setCompletedDate(null);

            task.setCompletedBy("");
        }

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}