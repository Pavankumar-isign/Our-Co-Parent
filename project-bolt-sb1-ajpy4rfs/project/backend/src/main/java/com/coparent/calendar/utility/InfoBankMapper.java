package com.coparent.calendar.utility;

import java.util.stream.Collectors;

import com.coparent.calendar.dto.InfoBankEntryDTO;
import com.coparent.calendar.dto.InfoBankFileDTO;
import com.coparent.calendar.entity.InfoBankEntry;
import com.coparent.calendar.entity.InfoBankFile;

public class InfoBankMapper {

	public static InfoBankEntryDTO toDTO(InfoBankEntry entry) {
		return InfoBankEntryDTO.builder().id(entry.getId()).title(entry.getTitle()).description(entry.getDescription())
				.section(entry.getSection()).isPrivate(entry.isPrivate()).isEmergencyContact(entry.isEmergencyContact())
				.createdBy(entry.getCreatedBy().getId()).createdAt(entry.getCreatedAt()).updatedAt(entry.getUpdatedAt())
				.associatedMemberIds(entry.getAssociatedMembers() != null
						? entry.getAssociatedMembers().stream().map(u -> u.getId()).collect(Collectors.toSet())
						: null)
				.files(entry.getFiles() != null
						? entry.getFiles().stream().map(InfoBankMapper::toFileDTO).collect(Collectors.toSet())
						: null)
				.build();
	}

	public static InfoBankFileDTO toFileDTO(InfoBankFile file) {
		return InfoBankFileDTO.builder().id(file.getId()).fileName(file.getFileName()).fileType(file.getFileType())
				.filePath(file.getFilePath()).uploadedAt(file.getUploadedAt()).build();
	}
}