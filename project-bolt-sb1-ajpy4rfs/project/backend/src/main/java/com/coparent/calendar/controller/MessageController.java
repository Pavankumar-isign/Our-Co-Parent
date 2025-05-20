package com.coparent.calendar.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.coparent.calendar.dto.MessageDTO;
import com.coparent.calendar.entity.Message;
import com.coparent.calendar.service.MessageService;
import com.coparent.calendar.utility.MessageMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
	private final MessageService messageService;

	@PostMapping
	public ResponseEntity<MessageDTO> sendMessage(@RequestParam String recipientId, @RequestParam String subject,
			@RequestParam String body, @RequestParam(required = false) Set<MultipartFile> attachments,
			@AuthenticationPrincipal UserDetails userDetails) {
		Message message = messageService.sendMessage(userDetails.getUsername(), recipientId, subject, body,
				attachments);
		return ResponseEntity.ok(MessageMapper.toDTO(message));
	}

	@GetMapping("/inbox")
	public ResponseEntity<Page<MessageDTO>> getInbox(@AuthenticationPrincipal UserDetails userDetails,
			Pageable pageable) {
		Page<Message> messages = messageService.getUserInbox(userDetails.getUsername(), pageable);
		return ResponseEntity.ok(messages.map(MessageMapper::toDTO));
	}

	@GetMapping("/sent")
	public ResponseEntity<Page<MessageDTO>> getSentMessages(@AuthenticationPrincipal UserDetails userDetails,
			Pageable pageable) {
		Page<Message> messages = messageService.getUserSentMessages(userDetails.getUsername(), pageable);
		return ResponseEntity.ok(messages.map(MessageMapper::toDTO));
	}

	@GetMapping("/threads")
	public ResponseEntity<Page<MessageDTO>> getThreads(@AuthenticationPrincipal UserDetails userDetails,
			Pageable pageable) {
		Page<Message> messages = messageService.getUserThreads(userDetails.getUsername(), pageable)
				.map(thread -> thread.getMessages().iterator().next()); // Get latest message from each thread
		return ResponseEntity.ok(messages.map(MessageMapper::toDTO));
	}

	@PostMapping("/{messageId}/read")
	public ResponseEntity<MessageDTO> markAsRead(@PathVariable String messageId,
			@AuthenticationPrincipal UserDetails userDetails) {
		Message message = messageService.markAsRead(messageId, userDetails.getUsername());
		return ResponseEntity.ok(MessageMapper.toDTO(message));
	}

	@PostMapping("/{messageId}/archive")
	public ResponseEntity<MessageDTO> archiveMessage(@PathVariable String messageId,
			@AuthenticationPrincipal UserDetails userDetails) {
		Message message = messageService.archiveMessage(messageId, userDetails.getUsername());
		return ResponseEntity.ok(MessageMapper.toDTO(message));
	}

	@GetMapping("/unread-count")
	public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
		long count = messageService.getUnreadCount(userDetails.getUsername());
		return ResponseEntity.ok(count);
	}

}