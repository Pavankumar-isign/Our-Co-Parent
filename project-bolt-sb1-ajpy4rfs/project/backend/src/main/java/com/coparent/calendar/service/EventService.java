package com.coparent.calendar.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coparent.calendar.dto.EventDTO;
import com.coparent.calendar.entity.CalendarEvent;
import com.coparent.calendar.repository.EventRepository;
import com.coparent.calendar.repository.UserRepository;
import com.coparent.calendar.utility.EventMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
	private final EventRepository eventRepository;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public List<EventDTO> getUserEvents(String userId, LocalDateTime start, LocalDateTime end) {
		return eventRepository.findUserEventsInRange(userId, start, end).stream().map(EventMapper::toDTO)

				.collect(Collectors.toList());
	}

	@Transactional
	public EventDTO createEvent(EventDTO eventDTO, String userId) {
//		eventDTO.setId(userId);
		CalendarEvent event = EventMapper.toEntity(eventDTO);
//		event.setId(userId);
		event.setCreatedBy(userRepository.getReferenceById(userId));

		// Set shared users
		if (eventDTO.getSharedWith() != null) {
			event.setSharedWith(eventDTO.getSharedWith().stream().map(userRepository::getReferenceById)
					.collect(Collectors.toSet()));
		}

		return EventMapper.toDTO(eventRepository.save(event));
	}

	@Transactional
	public EventDTO updateEvent(String eventId, EventDTO eventDTO, String userId) {
		CalendarEvent event = eventRepository.findById(eventId)
				.orElseThrow(() -> new RuntimeException("Event not found"));

		// Check if user has permission to update
		if (!event.getCreatedBy().getId().equals(userId)) {
			throw new RuntimeException("Not authorized to update this event");
		}

		EventMapper.updateEntity(event, eventDTO);
		return EventMapper.toDTO(eventRepository.save(event));
	}

	@Transactional
	public void deleteEvent(String eventId, String userId) {
		CalendarEvent event = eventRepository.findById(eventId)
				.orElseThrow(() -> new RuntimeException("Event not found"));

//		if (!event.getCreatedBy().getId().equals(userId)) {
//			throw new RuntimeException("Not authorized to delete this event");
//		}

		eventRepository.delete(event);
	}

	@Transactional(readOnly = true)
	public List<EventDTO> checkConflicts(LocalDateTime start, LocalDateTime end, String userId, String excludeEventId) {
		return eventRepository.findConflictingEvents(userId, start, end, excludeEventId).stream()
				.map(EventMapper::toDTO).collect(Collectors.toList());
	}

}