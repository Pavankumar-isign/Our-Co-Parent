package com.coparent.calendar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.coparent.calendar.entity.ExpenseCategory;

public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, String> {
	@Query("SELECT c FROM ExpenseCategory c " + "WHERE c.isCustom = false OR c.createdBy.id = :userId")
	List<ExpenseCategory> findAvailableCategories(@Param("userId") String userId);
}
