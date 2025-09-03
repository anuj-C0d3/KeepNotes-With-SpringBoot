package com.gts.keepnotes.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.core.SpringVersion;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column (unique = true,nullable = false)
    private String username;
    private  String password;

}
