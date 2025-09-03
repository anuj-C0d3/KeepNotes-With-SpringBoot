package com.gts.keepnotes.controller;


import com.gts.keepnotes.entity.Note;
import com.gts.keepnotes.service.NotesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AllController {
    private final NotesService notesService;
    @GetMapping("/share/{shareId}")
    public Note getShared(@PathVariable String shareId){
        return notesService.getSharedNote(shareId);
    }
}
