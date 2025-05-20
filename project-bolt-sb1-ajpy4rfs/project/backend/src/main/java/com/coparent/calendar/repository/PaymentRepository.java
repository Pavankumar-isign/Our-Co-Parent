package com.coparent.calendar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coparent.calendar.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, String> {
	List<Payment> findByExpenseId(String expenseId);
}
