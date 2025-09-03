package com.gts.keepnotes.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 2000)
    private String description;
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean isShared =  false;
    private String shareId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
