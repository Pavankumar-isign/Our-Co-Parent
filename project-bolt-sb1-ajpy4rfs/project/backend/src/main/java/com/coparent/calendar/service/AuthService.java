package com.coparent.calendar.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coparent.calendar.dto.AuthResponse;
import com.coparent.calendar.dto.LoginRequest;
import com.coparent.calendar.dto.RegisterRequest;
import com.coparent.calendar.dto.UserPrincipal;
import com.coparent.calendar.dto.UserResponse;
import com.coparent.calendar.entity.User;
import com.coparent.calendar.repository.UserRepository;
import com.coparent.calendar.security.JwtTokenProvider;
import com.coparent.calendar.utility.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider tokenProvider;

	public AuthResponse login(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = tokenProvider.generateToken(authentication);

		UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
		User user = userRepository.findById(userPrincipal.getId()).orElseThrow();

		return new AuthResponse(jwt, UserMapper.convertToUserResponse(user));
	}

	@Transactional
	public AuthResponse register(RegisterRequest registerRequest) {
		if (userRepository.existsByEmail(registerRequest.getEmail())) {
			throw new RuntimeException("Email already in use");
		}

		User user = User.builder().name(registerRequest.getName()).email(registerRequest.getEmail())
				.password(passwordEncoder.encode(registerRequest.getPassword())).role(registerRequest.getRole())
				.phone(registerRequest.getPhone()).address(registerRequest.getAddress())
				.profession(registerRequest.getProfession()).licenseNumber(registerRequest.getLicenseNumber())
				.color(generateUserColor()) // Assuming generateUserColor() returns a valid color string
				.build();

		user = userRepository.save(user);

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = tokenProvider.generateToken(authentication);

		return new AuthResponse(jwt, UserMapper.convertToUserResponse(user));
	}

	public UserResponse getCurrentUser() {
		UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
		return UserMapper.convertToUserResponse(user);
	}

	private String generateUserColor() {
		// Implement color generation logic
		String[] colors = { "#2563EB", "#10B981", "#8B5CF6", "#EC4899" };
		return colors[(int) (Math.random() * colors.length)];
	}
}