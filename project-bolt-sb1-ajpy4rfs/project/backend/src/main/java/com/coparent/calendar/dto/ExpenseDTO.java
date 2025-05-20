package com.coparent.calendar.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import com.coparent.calendar.entity.ExpenseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
	private String id;
	private String title;
	private BigDecimal amount;
	private LocalDateTime purchaseDate;
	private String description;
	private ExpenseCategoryDTO category;
	private Set<String> children; // List of child IDs
	private String receiptUrl;
	private boolean isPrivate;
	private ExpenseStatus status;
	private String createdBy;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}