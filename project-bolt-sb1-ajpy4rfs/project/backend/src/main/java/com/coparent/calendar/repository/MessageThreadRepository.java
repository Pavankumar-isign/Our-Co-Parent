package com.coparent.calendar.repository;

import com.coparent.calendar.entity.MessageThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageThreadRepository extends JpaRepository<MessageThread, String> {
    @Query("SELECT DISTINCT t FROM MessageThread t " +
           "JOIN t.participants p " +
           "WHERE p.id = :userId " +
           "ORDER BY t.updatedAt DESC")
    Page<MessageThread> findUserThreads(
        @Param("userId") String userId,
        Pageable pageable
    );
    
    @Query("SELECT t FROM MessageThread t " +
           "JOIN t.participants p1 " +
           "JOIN t.participants p2 " +
           "WHERE p1.id = :userId1 AND p2.id = :userId2 " +
           "AND t.subject = :subject")
    MessageThread findExistingThread(
        @Param("userId1") String userId1,
        @Param("userId2") String userId2,
        @Param("subject") String subject
    );
}