package com.gts.keepnotes.controller;

import com.gts.keepnotes.dto.NotesDto;
import com.gts.keepnotes.entity.Note;
import com.gts.keepnotes.service.NotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class NotesController {
    private final NotesService notesService;

    @PostMapping
    public ResponseEntity create(Authentication currentUser, Principal principal, @RequestBody NotesDto dto){
        System.out.println("Authenticated User "+ principal.getName());
        return new ResponseEntity<>(notesService.createNote(currentUser.getName(),dto), HttpStatus.CREATED);
    }
    @GetMapping
    public List<Note> getUserNotes(Authentication currentUser){
        return notesService.getUserNotes(currentUser.getName());
    }

    @PostMapping("/{id}/share")
    public Note share(@PathVariable Long id){
        return notesService.shareNote(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity update(@PathVariable Long id, @RequestBody NotesDto notesDto){
        return new ResponseEntity(notesService.update(id,notesDto),HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity deleteNotes(@PathVariable Long id){
        return new ResponseEntity(notesService.deleteNotes(id),HttpStatus.OK);
    }
}
