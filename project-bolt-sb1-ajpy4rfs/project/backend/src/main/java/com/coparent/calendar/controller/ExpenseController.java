package com.coparent.calendar.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.coparent.calendar.dto.ExpenseCategoryDTO;
import com.coparent.calendar.dto.ExpenseDTO;
import com.coparent.calendar.dto.PaymentDTO;
import com.coparent.calendar.entity.Expense;
import com.coparent.calendar.entity.ExpenseCategory;
import com.coparent.calendar.entity.ExpenseStatus;
import com.coparent.calendar.entity.Payment;
import com.coparent.calendar.repository.UserRepository;
import com.coparent.calendar.service.ExpenseService;
import com.coparent.calendar.utility.ExpenseMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {
	private final ExpenseService expenseService;
	private final UserRepository userRepository;

	@PostMapping
	public ResponseEntity<ExpenseDTO> createExpense(@RequestPart("expense") Expense expense,
			@RequestPart(value = "receipt", required = false) MultipartFile receipt,
			@AuthenticationPrincipal UserDetails userDetails) {
		expense.setCreatedBy(userRepository.findById(userDetails.getUsername()).orElseThrow());
		Expense savedExpense = expenseService.createExpense(expense, receipt);
		return ResponseEntity.ok(ExpenseMapper.toDTO(savedExpense));
	}

	@GetMapping
	public ResponseEntity<Page<ExpenseDTO>> getExpenses(@RequestParam(required = false) ExpenseStatus status,
			@RequestParam(required = false) String categoryId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
			@AuthenticationPrincipal UserDetails userDetails, Pageable pageable) {
		Page<Expense> expenses = expenseService.getUserExpenses(userDetails.getUsername(), status, categoryId,
				startDate, endDate, pageable);
		return ResponseEntity.ok(expenses.map(ExpenseMapper::toDTO));

	}

	@PutMapping("/{id}")
	public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable String id, @RequestBody Expense expense,
			@AuthenticationPrincipal UserDetails userDetails) {
		Expense updatedExpense = expenseService.updateExpense(id, expense);
		return ResponseEntity.ok(ExpenseMapper.toDTO(updatedExpense));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteExpense(@PathVariable String id,
			@AuthenticationPrincipal UserDetails userDetails) {
		expenseService.deleteExpense(id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{id}/approve")
	public ResponseEntity<ExpenseDTO> approveExpense(@PathVariable String id,
			@AuthenticationPrincipal UserDetails userDetails) {
		Expense expense = expenseService.approveExpense(id);
		return ResponseEntity.ok(ExpenseMapper.toDTO(expense));
	}

	@PostMapping("/{id}/reject")
	public ResponseEntity<ExpenseDTO> rejectExpense(@PathVariable String id,
			@AuthenticationPrincipal UserDetails userDetails) {
		Expense expense = expenseService.rejectExpense(id);
		return ResponseEntity.ok(ExpenseMapper.toDTO(expense));
	}

	@PostMapping("/{id}/payments")
	public ResponseEntity<PaymentDTO> recordPayment(@PathVariable String id, @RequestBody Payment payment,
			@AuthenticationPrincipal UserDetails userDetails) {
		payment.setPaidBy(userRepository.findById(userDetails.getUsername()).orElseThrow());
		Payment savedPayment = expenseService.recordPayment(payment);
		return ResponseEntity.ok(ExpenseMapper.toPaymentDTO(savedPayment));
	}

	@GetMapping("/categories")
	public ResponseEntity<List<ExpenseCategoryDTO>> getCategories(@AuthenticationPrincipal UserDetails userDetails) {
		List<ExpenseCategory> categories = expenseService.getAvailableCategories(userDetails.getUsername());
		return ResponseEntity.ok(
				categories.stream().map(ExpenseMapper::toCategoryDTO).collect(java.util.stream.Collectors.toList()));
	}

	@PostMapping("/categories")
	public ResponseEntity<ExpenseCategoryDTO> createCategory(@RequestBody ExpenseCategory category,
			@AuthenticationPrincipal UserDetails userDetails) {
		category.setCreatedBy(userRepository.findById(userDetails.getUsername()).orElseThrow());
		ExpenseCategory savedCategory = expenseService.createCustomCategory(category);
		return ResponseEntity.ok(ExpenseMapper.toCategoryDTO(savedCategory));
	}

}
