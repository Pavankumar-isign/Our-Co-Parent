package com.coparent.calendar.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.coparent.calendar.entity.Expense;
import com.coparent.calendar.entity.ExpenseCategory;
import com.coparent.calendar.entity.ExpenseStatus;
import com.coparent.calendar.entity.Payment;
import com.coparent.calendar.repository.ExpenseCategoryRepository;
import com.coparent.calendar.repository.ExpenseRepository;
import com.coparent.calendar.repository.PaymentRepository;
import com.coparent.calendar.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {
	private final ExpenseRepository expenseRepository;
	private final ExpenseCategoryRepository categoryRepository;
	private final PaymentRepository paymentRepository;
	private final FileStorageService fileStorageService;
	private final UserRepository userRepository;

	@Transactional
	public Expense createExpense(Expense expense, MultipartFile receipt) {
		if (receipt != null) {
			String receiptUrl = fileStorageService.storeFile(receipt);
			expense.setReceiptUrl(receiptUrl);
		}

		return expenseRepository.save(expense);
	}

	@Transactional
	public Expense updateExpense(String id, Expense updatedExpense) {
		Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));

		if (!expense.getStatus().equals(ExpenseStatus.PENDING)) {
			throw new RuntimeException("Cannot update expense that is not pending");
		}

		// Update fields
		expense.setTitle(updatedExpense.getTitle());
		expense.setAmount(updatedExpense.getAmount());
		expense.setDescription(updatedExpense.getDescription());
		expense.setCategory(updatedExpense.getCategory());
		expense.setChildren(updatedExpense.getChildren());
		expense.setPrivate(updatedExpense.isPrivate());

		return expenseRepository.save(expense);
	}

	@Transactional
	public void deleteExpense(String id) {
		Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));

		if (!expense.getStatus().equals(ExpenseStatus.PENDING)) {
			throw new RuntimeException("Cannot delete expense that is not pending");
		}

		expenseRepository.delete(expense);
	}

	@Transactional(readOnly = true)
	public Page<Expense> getUserExpenses(String userId, ExpenseStatus status, String categoryId,
			LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
		return expenseRepository.findUserExpenses(userId, status, categoryId, startDate, endDate, pageable);
	}

	@Transactional
	public Expense approveExpense(String id) {
		Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));

		expense.setStatus(ExpenseStatus.APPROVED);
		return expenseRepository.save(expense);
	}

	@Transactional
	public Expense rejectExpense(String id) {
		Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));

		expense.setStatus(ExpenseStatus.REJECTED);
		return expenseRepository.save(expense);
	}

	@Transactional
	public Payment recordPayment(Payment payment) {
		Expense expense = expenseRepository.findById(payment.getExpense().getId())
				.orElseThrow(() -> new RuntimeException("Expense not found"));

		payment.setExpense(expense);
		payment.setPaidAt(LocalDateTime.now());

		Payment savedPayment = paymentRepository.save(payment);

		// Update expense status if fully paid
		List<Payment> payments = paymentRepository.findByExpenseId(expense.getId());
		double totalPaid = payments.stream().mapToDouble(p -> p.getAmount().doubleValue()).sum();

		if (totalPaid >= expense.getAmount().doubleValue()) {
			expense.setStatus(ExpenseStatus.PAID);
			expenseRepository.save(expense);
		}

		return savedPayment;
	}

	@Transactional(readOnly = true)
	public List<ExpenseCategory> getAvailableCategories(String userId) {
		return categoryRepository.findAvailableCategories(userId);
	}

	@Transactional
	public ExpenseCategory createCustomCategory(ExpenseCategory category) {
		category.setCustom(true);
		return categoryRepository.save(category);
	}
}
