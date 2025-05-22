package com.coparent.calendar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.coparent.calendar.entity.CoParent;

public interface CoParentRepository extends JpaRepository<CoParent, String> {
	CoParent findByUserId(String userId);

	boolean existsByEmail(String email);

	@Query("SELECT cp FROM CoParent cp WHERE cp.user.id = :userId")
	CoParent findByMainUserId(@Param("userId") String userId);

	CoParent findByLinkedById(String linkedByUserId);

	Optional<CoParent> findByEmail(String email);

}
