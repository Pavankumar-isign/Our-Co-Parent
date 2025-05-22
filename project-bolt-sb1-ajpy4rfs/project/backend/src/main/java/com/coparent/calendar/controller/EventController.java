package com.coparent.calendar.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RestController;

import com.coparent.calendar.dto.EventDTO;
import com.coparent.calendar.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/calendar/events")
@RequiredArgsConstructor
public class EventController {
	private final EventService eventService;

	@GetMapping
	public ResponseEntity<List<EventDTO>> getEvents(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
			@AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(eventService.getUserEvents(userDetails.getUsername(), start, end));
	}

	@PostMapping
	public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		System.out.println(eventDTO);
//		return ResponseEntity.ok(eventService.createEvent(eventDTO, userDetails.getUsername())); 
		return ResponseEntity.ok(eventService.createEvent(eventDTO, userDetails.getUsername()));
	}

	@PutMapping("/{eventId}")
	public ResponseEntity<EventDTO> updateEvent(@PathVariable String eventId, @RequestBody EventDTO eventDTO,
			@AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(eventService.updateEvent(eventId, eventDTO, userDetails.getUsername()));
	}

	@DeleteMapping("/{eventId}")
	public ResponseEntity<Void> deleteEvent(@PathVariable String eventId,
			@AuthenticationPrincipal UserDetails userDetails) {
		eventService.deleteEvent(eventId, userDetails.getUsername());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/conflicts")
	public ResponseEntity<List<EventDTO>> checkConflicts(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
			@RequestParam(required = false) String excludeEventId, @AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(eventService.checkConflicts(start, end, userDetails.getUsername(), excludeEventId));
	}
}