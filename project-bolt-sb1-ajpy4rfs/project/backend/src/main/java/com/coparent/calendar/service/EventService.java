package com.coparent.calendar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coparent.calendar.dto.EventDTO;
import com.coparent.calendar.entity.CalendarEvent;
import com.coparent.calendar.entity.CoParent;
import com.coparent.calendar.entity.User;
import com.coparent.calendar.repository.CoParentRepository;
import com.coparent.calendar.repository.EventRepository;
import com.coparent.calendar.repository.UserRepository;
import com.coparent.calendar.utility.EventMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
	private final EventRepository eventRepository;
	private final UserRepository userRepository;
	private final CoParentRepository coParentRepository;

//	@Transactional(readOnly = true)
//	public List<EventDTO> getUserEvents(String userId, LocalDateTime start, LocalDateTime end) {
//		return eventRepository.findUserEventsInRangeByEmail(userId, start, end).stream().map(EventMapper::toDTO)
//				.collect(Collectors.toList());
//
//	}

	@Transactional(readOnly = true)
	public List<EventDTO> getUserEvents(String currentUserEmail, LocalDateTime start, LocalDateTime end) {
		// 1. Get the current logged-in user
		User currentUser = userRepository.findByEmail(currentUserEmail)
				.orElseThrow(() -> new RuntimeException("User not found"));

		// 2. Find the co-parent entry where currentUser is the owner (user_id column)
		CoParent coParent = coParentRepository.findByLinkedById(currentUser.getId());

		// 3. From that, get the co-parent's actual user record (saved earlier in
		// setCoParent)
		String coParentUserId = null;
		if (coParent != null && coParent.getUser() != null) {
			coParentUserId = coParent.getUser().getId();
		}

		// 4. Prepare list of user IDs to query
		List<String> userIds = new ArrayList<>();
		userIds.add(currentUser.getId());

		if (coParentUserId != null && !coParentUserId.equals(currentUser.getId())) {
			userIds.add(coParentUserId);
		}

		// 5. Fetch events for both
		return eventRepository.findUserEventsInRange(userIds, start, end).stream().map(EventMapper::toDTO)
				.collect(Collectors.toList());
	}

	@Transactional
	public EventDTO createEvent(EventDTO eventDTO, String userId) {
		CalendarEvent event = EventMapper.toEntity(eventDTO);

		User creator = userRepository.findByEmail(userId)
				.orElseThrow(() -> new RuntimeException("User not found: " + userId));
		event.setCreatedBy(creator);

		// Set shared users (Co-parent)
		if (eventDTO.getSharedWith() != null && !eventDTO.getSharedWith().isEmpty()) {
			Set<User> sharedUsers = eventDTO.getSharedWith().stream().map(coParentId -> {
				CoParent coParent = coParentRepository.findById(coParentId)
						.orElseThrow(() -> new RuntimeException("Co-parent not found for ID: " + coParentId));

				return userRepository.findByEmail(coParent.getEmail()).orElseThrow(
						() -> new RuntimeException("Co-parent user not found for email: " + coParent.getEmail()));
			}).collect(Collectors.toSet());
			event.setSharedWith(sharedUsers);
			System.out.println("Saving event by user: " + event.getCreatedBy().getId());
			System.out.println("Shared with: " + event.getSharedWith().stream().map(User::getId).toList());

			event.setSharedWith(sharedUsers);
		}

		return EventMapper.toDTO(eventRepository.save(event));
	}

	@Transactional
	public EventDTO updateEvent(String eventId, EventDTO eventDTO, String userId) {
		CalendarEvent event = eventRepository.findById(eventId)
				.orElseThrow(() -> new RuntimeException("Event not found"));

		// Check if user has permission to update
		if (!event.getCreatedBy().getEmail().equals(userId)) {
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