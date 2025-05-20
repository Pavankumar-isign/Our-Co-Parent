package com.coparent.calendar.utility;

import java.util.stream.Collectors;

import com.coparent.calendar.dto.ExpenseCategoryDTO;
import com.coparent.calendar.dto.ExpenseDTO;
import com.coparent.calendar.dto.PaymentDTO;
import com.coparent.calendar.entity.Expense;
import com.coparent.calendar.entity.ExpenseCategory;
import com.coparent.calendar.entity.Payment;

public class ExpenseMapper {

	public static ExpenseDTO toDTO(Expense expense) {
		return ExpenseDTO.builder().id(expense.getId()).title(expense.getTitle()).amount(expense.getAmount())
				.purchaseDate(expense.getPurchaseDate()).description(expense.getDescription())
				.receiptUrl(expense.getReceiptUrl()).isPrivate(expense.isPrivate()).status(expense.getStatus())
				.createdBy(expense.getCreatedBy().getId()).category(toCategoryDTO(expense.getCategory()))
				.children(expense.getChildren() != null
						? expense.getChildren().stream().map(child -> child.getId()).collect(Collectors.toSet())
						: null)
				.createdAt(expense.getCreatedAt()).updatedAt(expense.getUpdatedAt()).build();
	}

	public static ExpenseCategoryDTO toCategoryDTO(ExpenseCategory category) {
		return ExpenseCategoryDTO.builder().id(category.getId()).name(category.getName())
				.splitRatio(category.getSplitRatio()).build();
	}

	public static PaymentDTO toPaymentDTO(Payment payment) {
		return PaymentDTO.builder().id(payment.getId()).amount(payment.getAmount()).method(payment.getMethod().name())
				.confirmed(payment.isConfirmed()).paidBy(payment.getPaidBy().getId()).build();
	}
}
