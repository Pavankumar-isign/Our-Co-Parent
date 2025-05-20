package com.coparent.calendar.utility;

import java.util.Set;
import java.util.stream.Collectors;

import com.coparent.calendar.dto.MessageAttachmentDTO;
import com.coparent.calendar.dto.MessageDTO;
import com.coparent.calendar.entity.Message;
import com.coparent.calendar.entity.MessageAttachment;
import com.coparent.calendar.entity.MessageStatus;

public class MessageMapper {

	public static MessageDTO toDTO(Message message) {
		return MessageDTO.builder().id(message.getId()).subject(message.getSubject()).body(message.getBody())
				.senderId(message.getSender().getId())
				.recipientIds(message.getThread().getParticipants().stream().map(user -> user.getId())
						.filter(id -> !id.equals(message.getSender().getId())).collect(Collectors.toSet()))
				.isRead(message.getReadAt() != null).isArchived(message.getStatus() == MessageStatus.ARCHIVED)
				.sentAt(message.getSentAt()).toneAnalysis(message.getToneAnalysis())
				.attachments(toAttachmentDTOs(message.getAttachments())).build();
	}

	private static Set<MessageAttachmentDTO> toAttachmentDTOs(Set<MessageAttachment> attachments) {
		if (attachments == null)
			return null;
		return attachments.stream().map(MessageMapper::toDTO).collect(Collectors.toSet());
	}

	private static MessageAttachmentDTO toDTO(MessageAttachment attachment) {
		return MessageAttachmentDTO.builder().id(attachment.getId()).fileName(attachment.getFileName())
				.fileType(attachment.getFileType()).filePath(attachment.getFilePath())
				.fileSize(attachment.getFileSize()).uploadedAt(attachment.getUploadedAt()).build();
	}
}