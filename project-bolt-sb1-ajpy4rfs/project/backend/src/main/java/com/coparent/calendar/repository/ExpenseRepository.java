package com.coparent.calendar.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.coparent.calendar.entity.Expense;
import com.coparent.calendar.entity.ExpenseStatus;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
//	@Query("SELECT e FROM Expense e " + "WHERE (e.createdBy.id = :userId OR "
//			+ "EXISTS (SELECT c FROM e.children c WHERE c.parent1.id = :userId OR c.parent2.id = :userId)) "
//			+ "AND (:status IS NULL OR e.status = :status) "
//			+ "AND (:categoryId IS NULL OR e.category.id = :categoryId) "
//			+ "AND (e.purchaseDate BETWEEN :startDate AND :endDate) " + "ORDER BY e.purchaseDate DESC")
//	Page<Expense> findUserExpenses(@Param("userId") String userId, @Param("status") ExpenseStatus status,
//			@Param("categoryId") String categoryId, @Param("startDate") LocalDateTime startDate,
//			@Param("endDate") LocalDateTime endDate, Pageable pageable);

	@Query("""
			    SELECT e FROM Expense e
			    WHERE (e.createdBy.id = :userId OR
			           EXISTS (SELECT c FROM e.children c WHERE c.parent.id = :userId))
			      AND (:status IS NULL OR e.status = :status)
			      AND (:categoryId IS NULL OR e.category.id = :categoryId)
			      AND (e.purchaseDate BETWEEN :startDate AND :endDate)
			    ORDER BY e.purchaseDate DESC
			""")
	Page<Expense> findUserExpenses(@Param("userId") String userId, @Param("status") ExpenseStatus status,
			@Param("categoryId") String categoryId, @Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate, Pageable pageable);

	@Query("""
			    SELECT e FROM Expense e
			    WHERE e.createdBy.id = :userId
			    AND e.status = :status
			    ORDER BY e.purchaseDate DESC
			""")
	List<Expense> findByCreatedByAndStatus(@Param("userId") String userId, @Param("status") ExpenseStatus status);

}
