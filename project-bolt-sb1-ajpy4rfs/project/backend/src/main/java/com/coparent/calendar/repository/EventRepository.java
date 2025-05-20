package com.coparent.calendar.repository;

import com.coparent.calendar.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<CalendarEvent, String> {
    @Query("SELECT e FROM CalendarEvent e WHERE " +
           "(e.createdBy.id = :userId OR :userId IN (SELECT u.id FROM e.sharedWith u)) AND " +
           "((e.startTime BETWEEN :start AND :end) OR " +
           "(e.endTime BETWEEN :start AND :end) OR " +
           "(e.startTime <= :start AND e.endTime >= :end))")
    List<CalendarEvent> findUserEventsInRange(
        @Param("userId") String userId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
    
    @Query("SELECT e FROM CalendarEvent e WHERE " +
           "e.id != :excludeEventId AND " +
           "(e.createdBy.id = :userId OR :userId IN (SELECT u.id FROM e.sharedWith u)) AND " +
           "((e.startTime BETWEEN :start AND :end) OR " +
           "(e.endTime BETWEEN :start AND :end) OR " +
           "(e.startTime <= :start AND e.endTime >= :end))")
    List<CalendarEvent> findConflictingEvents(
        @Param("userId") String userId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("excludeEventId") String excludeEventId
    );
}