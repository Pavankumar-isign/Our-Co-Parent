package com.coparent.calendar.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Embeddable
public class RecurrenceRule {
    @Enumerated(EnumType.STRING)
    private RecurrenceType type;
    
    @Enumerated(EnumType.STRING)
    private RecurrenceEndType endType;
    
    private LocalDateTime until;
    
    private Integer count;
}