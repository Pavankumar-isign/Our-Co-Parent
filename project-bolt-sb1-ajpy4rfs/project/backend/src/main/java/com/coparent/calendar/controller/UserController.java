
package com.coparent.calendar.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coparent.calendar.dto.UserFamilyDTO;
import com.coparent.calendar.entity.Child;
import com.coparent.calendar.entity.CoParent;
import com.coparent.calendar.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@PostMapping("/co-parent")
	public ResponseEntity<CoParent> setCoParent(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody CoParent coParent) {
		CoParent savedCoParent = userService.setCoParent(userDetails.getUsername(), coParent);
		return ResponseEntity.ok(savedCoParent);
	}

	@PostMapping("/children")
	public ResponseEntity<List<Child>> addChildren(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody List<Child> children) {
		List<Child> savedChildren = userService.addChildren(userDetails.getUsername(), children);
		return ResponseEntity.ok(savedChildren);
	}

	@PutMapping("/children/{childId}")
	public ResponseEntity<Child> updateChild(@AuthenticationPrincipal UserDetails userDetails,
			@PathVariable String childId, @Valid @RequestBody Child child) {
		Child updatedChild = userService.updateChild(userDetails.getUsername(), childId, child);
		return ResponseEntity.ok(updatedChild);
	}

	@GetMapping("/family")
	public ResponseEntity<UserFamilyDTO> getUserFamily(@AuthenticationPrincipal UserDetails userDetails) {
		UserFamilyDTO family = userService.getUserFamily(userDetails.getUsername());
		return ResponseEntity.ok(family);
	}
}