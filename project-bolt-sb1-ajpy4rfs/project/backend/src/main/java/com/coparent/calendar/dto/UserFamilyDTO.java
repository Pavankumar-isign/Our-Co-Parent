package com.coparent.calendar.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFamilyDTO {
	private CoParentDTO coParent;
	private List<ChildDTO> children;
}
