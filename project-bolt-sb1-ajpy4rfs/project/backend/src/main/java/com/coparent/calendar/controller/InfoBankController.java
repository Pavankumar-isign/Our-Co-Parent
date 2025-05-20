package com.coparent.calendar.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.coparent.calendar.dto.InfoBankEntryDTO;
import com.coparent.calendar.entity.InfoBankEntry;
import com.coparent.calendar.entity.InfoBankSection;
import com.coparent.calendar.repository.UserRepository;
import com.coparent.calendar.service.InfoBankService;
import com.coparent.calendar.utility.InfoBankMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/info-bank")
@RequiredArgsConstructor
public class InfoBankController {
	private final InfoBankService infoBankService;
	private final UserRepository userRepository;

	@PostMapping
	public ResponseEntity<InfoBankEntryDTO> createEntry(@RequestPart("entry") InfoBankEntry entry,
			@RequestPart(value = "files", required = false) Set<MultipartFile> files,
			@AuthenticationPrincipal UserDetails userDetails) {
		entry.setCreatedBy(userRepository.findById(userDetails.getUsername()).orElseThrow());
		InfoBankEntry savedEntry = infoBankService.createEntry(entry, files);
		return ResponseEntity.ok(InfoBankMapper.toDTO(savedEntry));
	}

	@GetMapping
	public ResponseEntity<Page<InfoBankEntryDTO>> getEntries(@RequestParam(required = false) InfoBankSection section,
			@AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
		Page<InfoBankEntry> entries = infoBankService.getUserEntries(userDetails.getUsername(), section, pageable);
		return ResponseEntity.ok(entries.map(InfoBankMapper::toDTO));
	}

	@GetMapping("/emergency-contacts")
	public ResponseEntity<Page<InfoBankEntryDTO>> getEmergencyContacts(@AuthenticationPrincipal UserDetails userDetails,
			Pageable pageable) {
		Page<InfoBankEntry> contacts = infoBankService.getEmergencyContacts(userDetails.getUsername(), pageable);
		return ResponseEntity.ok(contacts.map(InfoBankMapper::toDTO));
	}

	@PutMapping("/{id}")
	public ResponseEntity<InfoBankEntryDTO> updateEntry(@PathVariable String id, @RequestBody InfoBankEntry entry,
			@AuthenticationPrincipal UserDetails userDetails) {
		InfoBankEntry updatedEntry = infoBankService.updateEntry(id, entry);
		return ResponseEntity.ok(InfoBankMapper.toDTO(updatedEntry));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteEntry(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
		infoBankService.deleteEntry(id);
		return ResponseEntity.noContent().build();
	}

}