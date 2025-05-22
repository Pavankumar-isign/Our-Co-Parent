package com.coparent.calendar.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.coparent.calendar.entity.CalendarEvent;

public interface EventRepository extends JpaRepository<CalendarEvent, String> {
	@Query("SELECT e FROM CalendarEvent e WHERE "
			+ "(e.createdBy.email = :userEmail OR :userEmail IN (SELECT u.email FROM e.sharedWith u)) AND "
			+ "((e.startTime BETWEEN :start AND :end) OR " + "(e.endTime BETWEEN :start AND :end) OR "
			+ "(e.startTime <= :start AND e.endTime >= :end))")
	List<CalendarEvent> findUserEventsInRangeByEmail(@Param("userEmail") String userEmail,
			@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	@Query("SELECT e FROM CalendarEvent e WHERE " + "(e.createdBy.id IN :userIds OR EXISTS "
			+ "(SELECT u FROM e.sharedWith u WHERE u.id IN :userIds)) AND "
			+ "((e.startTime BETWEEN :start AND :end) OR " + "(e.endTime BETWEEN :start AND :end) OR "
			+ "(e.startTime <= :start AND e.endTime >= :end))")
	List<CalendarEvent> findUserEventsInRange(@Param("userIds") List<String> userIds,
			@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

	@Query("SELECT e FROM CalendarEvent e WHERE " + "e.id != :excludeEventId AND "
			+ "(e.createdBy.id = :userId OR :userId IN (SELECT u.id FROM e.sharedWith u)) AND "
			+ "((e.startTime BETWEEN :start AND :end) OR " + "(e.endTime BETWEEN :start AND :end) OR "
			+ "(e.startTime <= :start AND e.endTime >= :end))")
	List<CalendarEvent> findConflictingEvents(@Param("userId") String userId, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end, @Param("excludeEventId") String excludeEventId);
}