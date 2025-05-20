package com.coparent.calendar.service;

import com.coparent.calendar.entity.*;
import com.coparent.calendar.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final MessageThreadRepository threadRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    @Transactional
    public Message sendMessage(String senderId, String recipientId, String subject, String body, Set<MultipartFile> attachments) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User recipient = userRepository.findById(recipientId).orElseThrow();
        
        // Check for existing thread or create new one
        MessageThread thread = threadRepository.findExistingThread(senderId, recipientId, subject);
        if (thread == null) {
            thread = new MessageThread();
            thread.setSubject(subject);
            thread.setParticipants(Set.of(sender, recipient));
            thread.setCreatedAt(LocalDateTime.now());
            thread.setUpdatedAt(LocalDateTime.now());
            thread = threadRepository.save(thread);
        }
        
        Message message = new Message();
        message.setSender(sender);
        message.setThread(thread);
        message.setSubject(subject);
        message.setBody(body);
        message.setSentAt(LocalDateTime.now());
        message.setStatus(MessageStatus.SENT);
        
        // Handle attachments
        if (attachments != null && !attachments.isEmpty()) {
            Set<MessageAttachment> messageAttachments = attachments.stream()
                .map(file -> {
                    String filePath = fileStorageService.storeFile(file);
                    
                    MessageAttachment attachment = new MessageAttachment();
                    attachment.setMessage(message);
                    attachment.setFileName(file.getOriginalFilename());
                    attachment.setFileType(file.getContentType());
                    attachment.setFilePath(filePath);
                    attachment.setFileSize(file.getSize());
                    attachment.setUploadedAt(LocalDateTime.now());
                    
                    return attachment;
                })
                .collect(java.util.stream.Collectors.toSet());
            
            message.setAttachments(messageAttachments);
        }
        
        return messageRepository.save(message);
    }
    
    @Transactional(readOnly = true)
    public Page<Message> getUserInbox(String userId, Pageable pageable) {
        return messageRepository.findUserMessages(userId, MessageStatus.SENT, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<Message> getUserSentMessages(String userId, Pageable pageable) {
        return messageRepository.findUserSentMessages(userId, MessageStatus.SENT, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<MessageThread> getUserThreads(String userId, Pageable pageable) {
        return threadRepository.findUserThreads(userId, pageable);
    }
    
    @Transactional
    public Message markAsRead(String messageId, String userId) {
        Message message = messageRepository.findById(messageId).orElseThrow();
        
        // Only mark as read if the user is a participant and not the sender
        if (!message.getSender().getId().equals(userId) && 
            message.getThread().getParticipants().stream()
                .anyMatch(p -> p.getId().equals(userId))) {
            message.setReadAt(LocalDateTime.now());
            return messageRepository.save(message);
        }
        
        return message;
    }
    
    @Transactional
    public Message archiveMessage(String messageId, String userId) {
        Message message = messageRepository.findById(messageId).orElseThrow();
        
        // Only allow archiving if user is a participant
        if (message.getThread().getParticipants().stream()
                .anyMatch(p -> p.getId().equals(userId))) {
            message.setStatus(MessageStatus.ARCHIVED);
            return messageRepository.save(message);
        }
        
        throw new RuntimeException("Not authorized to archive this message");
    }
    
    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        return messageRepository.countUnreadMessages(userId);
    }
}