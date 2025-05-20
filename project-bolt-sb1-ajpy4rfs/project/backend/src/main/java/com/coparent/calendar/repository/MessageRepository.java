package com.coparent.calendar.repository;

import com.coparent.calendar.entity.Message;
import com.coparent.calendar.entity.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, String> {
    @Query("SELECT m FROM Message m " +
           "WHERE m.thread.id IN (SELECT t.id FROM MessageThread t JOIN t.participants p WHERE p.id = :userId) " +
           "AND m.status = :status " +
           "ORDER BY m.sentAt DESC")
    Page<Message> findUserMessages(
        @Param("userId") String userId,
        @Param("status") MessageStatus status,
        Pageable pageable
    );
    
    @Query("SELECT m FROM Message m " +
           "WHERE m.sender.id = :userId " +
           "AND m.status = :status " +
           "ORDER BY m.sentAt DESC")
    Page<Message> findUserSentMessages(
        @Param("userId") String userId,
        @Param("status") MessageStatus status,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(m) FROM Message m " +
           "WHERE m.thread.id IN (SELECT t.id FROM MessageThread t JOIN t.participants p WHERE p.id = :userId) " +
           "AND m.readAt IS NULL " +
           "AND m.sender.id != :userId")
    long countUnreadMessages(@Param("userId") String userId);
}