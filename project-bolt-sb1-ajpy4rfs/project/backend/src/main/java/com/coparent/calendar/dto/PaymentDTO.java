package com.coparent.calendar.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
	private String id;
	private BigDecimal amount;
	private String method;
	private boolean confirmed;
	private String paidBy;
	private LocalDateTime paymentDate;
}