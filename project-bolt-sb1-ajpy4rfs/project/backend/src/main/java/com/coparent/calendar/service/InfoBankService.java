package com.coparent.calendar.service;

import com.coparent.calendar.entity.*;
import com.coparent.calendar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class InfoBankService {
    private final InfoBankEntryRepository entryRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    
    @Transactional
    public InfoBankEntry createEntry(InfoBankEntry entry, Set<MultipartFile> files) {
        if (files != null && !files.isEmpty()) {
            Set<InfoBankFile> entryFiles = files.stream()
                .map(file -> {
                    String filePath = fileStorageService.storeFile(file);
                    
                    InfoBankFile entryFile = new InfoBankFile();
                    entryFile.setEntry(entry);
                    entryFile.setFileName(file.getOriginalFilename());
                    entryFile.setFileType(file.getContentType());
                    entryFile.setFilePath(filePath);
                    entryFile.setFileSize(file.getSize());
                    entryFile.setUploadedAt(LocalDateTime.now());
                    
                    return entryFile;
                })
                .collect(java.util.stream.Collectors.toSet());
            
            entry.setFiles(entryFiles);
        }
        
        return entryRepository.save(entry);
    }
    
    @Transactional
    public InfoBankEntry updateEntry(String id, InfoBankEntry updatedEntry) {
        InfoBankEntry entry = entryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Entry not found"));
            
        entry.setTitle(updatedEntry.getTitle());
        entry.setDescription(updatedEntry.getDescription());
        entry.setSection(updatedEntry.getSection());
        entry.setAssociatedMembers(updatedEntry.getAssociatedMembers());
        entry.setPrivate(updatedEntry.isPrivate());
        entry.setEmergencyContact(updatedEntry.isEmergencyContact());
        
        return entryRepository.save(entry);
    }
    
    @Transactional
    public void deleteEntry(String id) {
        entryRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public Page<InfoBankEntry> getUserEntries(
        String userId,
        InfoBankSection section,
        Pageable pageable
    ) {
        return entryRepository.findUserEntries(userId, section, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<InfoBankEntry> getEmergencyContacts(String userId, Pageable pageable) {
        return entryRepository.findEmergencyContacts(userId, pageable);
    }
}