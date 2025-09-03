package com.gts.keepnotes.service;

import com.gts.keepnotes.dto.NotesDto;
import com.gts.keepnotes.entity.Note;
import com.gts.keepnotes.entity.User;
import com.gts.keepnotes.repository.NotesRepository;
import com.gts.keepnotes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotesService {
    private final NotesRepository notesRepository;
    private final UserRepository userRepository;
    public Note createNote(String username, NotesDto dto){

            User user = userRepository.findByUsername(username).orElseThrow();
            Note note = new Note();
            note.setTitle(dto.getTitle());
            note.setDescription(dto.getDescription());
            note.setUser(user);
            return notesRepository.save(note);

    }
    public List<Note> getUserNotes(String username){
        User user = userRepository.findByUsername(username).orElseThrow();
        return user.getId()!=null?notesRepository.findAll() : List.of();
    }
    public Note shareNote(Long id){
        Note note = notesRepository.findById(id).orElseThrow();
        note.setShared(true);
        note.setShareId(UUID.randomUUID().toString());
        return notesRepository.save(note);
    }
    public Note getSharedNote(String shareId){
        return notesRepository.findByShareId(shareId).orElseThrow();
    }
    public Note update(Long id, NotesDto res){
        Note note = notesRepository.findById(id).orElseThrow();
        note.setTitle(res.getTitle());
        note.setDescription(res.getDescription());
        return notesRepository.save(note);
    }
    public String deleteNotes(Long id){
        Note note = notesRepository.findById(id).orElse(null);

        if(note!=null) {
            notesRepository.deleteById(id);
            return "deleted";
        } else {
            return "Not found";
        }

    }
}
