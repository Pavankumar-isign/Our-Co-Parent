package com.coparent.calendar.repository;

import com.coparent.calendar.entity.InfoBankEntry;
import com.coparent.calendar.entity.InfoBankSection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InfoBankEntryRepository extends JpaRepository<InfoBankEntry, String> {
    @Query("SELECT e FROM InfoBankEntry e " +
           "WHERE (e.createdBy.id = :userId OR " +
           "EXISTS (SELECT m FROM e.associatedMembers m WHERE m.id = :userId)) " +
           "AND (:section IS NULL OR e.section = :section) " +
           "AND (e.isPrivate = false OR e.createdBy.id = :userId)")
    Page<InfoBankEntry> findUserEntries(
        @Param("userId") String userId,
        @Param("section") InfoBankSection section,
        Pageable pageable
    );
    
    @Query("SELECT e FROM InfoBankEntry e " +
           "WHERE e.isEmergencyContact = true " +
           "AND (e.createdBy.id = :userId OR " +
           "EXISTS (SELECT m FROM e.associatedMembers m WHERE m.id = :userId))")
    Page<InfoBankEntry> findEmergencyContacts(
        @Param("userId") String userId,
        Pageable pageable
    );
}