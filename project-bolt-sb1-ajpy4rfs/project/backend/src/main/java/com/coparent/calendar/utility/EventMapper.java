package com.coparent.calendar.utility;

import java.util.stream.Collectors;

import com.coparent.calendar.dto.EventDTO;
import com.coparent.calendar.entity.CalendarEvent;

public class EventMapper {

	public static EventDTO toDTO(CalendarEvent event) {
		return EventDTO.builder().id(event.getId()).title(event.getTitle()).description(event.getDescription())
				.start(event.getStartTime()).end(event.getEndTime()).allDay(event.isAllDay())
				.eventType(event.getEventType()).color(event.getColor()).recurrence(event.getRecurrence())
				.createdBy(event.getCreatedBy().getId())
				.sharedWith(event.getSharedWith() != null
						? event.getSharedWith().stream().map(u -> u.getId()).collect(Collectors.toSet())
						: null)
				.build();
	}

	public static CalendarEvent toEntity(EventDTO dto) {
		CalendarEvent event = new CalendarEvent();
		event.setTitle(dto.getTitle());
		event.setDescription(dto.getDescription());
		event.setStartTime(dto.getStart());
		event.setEndTime(dto.getEnd());
		event.setAllDay(dto.isAllDay());
		event.setEventType(dto.getEventType());
		event.setColor(dto.getColor());
		event.setRecurrence(dto.getRecurrence());
		// createdBy and sharedWith are set in the service
		return event;
	}

	public static void updateEntity(CalendarEvent event, EventDTO dto) {
		event.setTitle(dto.getTitle());
		event.setDescription(dto.getDescription());
		event.setStartTime(dto.getStart());
		event.setEndTime(dto.getEnd());
		event.setAllDay(dto.isAllDay());
		event.setEventType(dto.getEventType());
		event.setColor(dto.getColor());
		event.setRecurrence(dto.getRecurrence());
	}
}
