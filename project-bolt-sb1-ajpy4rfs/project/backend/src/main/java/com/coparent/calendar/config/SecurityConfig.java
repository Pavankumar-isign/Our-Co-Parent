package com.coparent.calendar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.coparent.calendar.security.CustomUserDetailsService;
import com.coparent.calendar.security.JwtAuthenticationFilter;
import com.coparent.calendar.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomUserDetailsService customUserDetailsService;
	private final JwtTokenProvider tokenProvider;
	private final CorsConfigurationSource corsConfigurationSource; // Injected CORS config

	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter(tokenProvider, customUserDetailsService);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

//	@Bean
//	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//		// Make sure CORS is configured before any other filters
//		http.cors().configurationSource(corsConfigurationSource) // Apply CORS configuration
//				.and().csrf().disable() // Disable CSRF for stateless JWT authentication
//				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless session
//																							// management
//				.and().authorizeRequests().requestMatchers("/auth/**").permitAll() // Allow public access to
//																					// authentication endpoints
//				.anyRequest().authenticated(); // Secure all other endpoints
//
//		// Add the JWT filter before UsernamePasswordAuthenticationFilter
//		http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//
//		return http.build();
//	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf().disable().authorizeRequests()
//                	.requestMatchers("/api/users/register",  "/api/users/logout", "/api/users/login", "/api/roles/createRole", "/api/users/resetpassword","/api/users/soft-delete/**","/api/password/send-otp","/api/password/reset-password","/api/roles","/api/users/refresh","api/restaurants","api/branches/restaurant","api/customers/**/incrementOrderCount").permitAll()
//                	 .requestMatchers("/api/admin").hasRole("ADMIN")
//                	 .requestMatchers("/api/user").hasRole("USER")
//                	 .requestMatchers("/api/adminAndUser").hasAnyRole("USER","ADMIN") 
//                	.anyRequest().authenticated()
				.anyRequest().permitAll().and().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
				.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
