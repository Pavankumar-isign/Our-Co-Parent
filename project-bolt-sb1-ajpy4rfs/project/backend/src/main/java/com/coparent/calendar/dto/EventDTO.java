package com.coparent.calendar.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.coparent.calendar.entity.EventType;
import com.coparent.calendar.entity.RecurrenceRule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
	private String id;
	private String title;
	private String description;
	private LocalDateTime start;
	private LocalDateTime end;
	private boolean allDay;
	private EventType eventType;
	private Set<String> sharedWith; // List of user IDs
	private String color;
	private RecurrenceRule recurrence;
	private String createdBy; // User ID
}