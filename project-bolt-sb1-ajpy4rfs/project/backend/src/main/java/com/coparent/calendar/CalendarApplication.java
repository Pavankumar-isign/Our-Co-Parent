package com.coparent.calendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.validation.annotation.Validated;

@EnableJpaAuditing
@SpringBootApplication
@Validated
public class CalendarApplication {
	public static void main(String[] args) {
		SpringApplication.run(CalendarApplication.class, args);
	}
}