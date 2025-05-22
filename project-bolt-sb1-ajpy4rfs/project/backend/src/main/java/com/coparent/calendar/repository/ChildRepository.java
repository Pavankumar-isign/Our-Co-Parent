package com.coparent.calendar.repository;

import com.coparent.calendar.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChildRepository extends JpaRepository<Child, String> {
    List<Child> findByParentId(String parentId);
}
