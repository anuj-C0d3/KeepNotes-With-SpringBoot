package com.gts.keepnotes.repository;

import com.gts.keepnotes.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotesRepository extends JpaRepository<Note,Long> {
    Optional<Note> findByShareId(String shareId);
}
