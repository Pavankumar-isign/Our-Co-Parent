package com.coparent.calendar.utility;

import com.coparent.calendar.dto.ChildDTO;
import com.coparent.calendar.dto.CoParentDTO;
import com.coparent.calendar.entity.Child;
import com.coparent.calendar.entity.CoParent;

import java.util.List;
import java.util.stream.Collectors;

public class UserFamilyMapper {

    public static CoParentDTO toCoParentDTO(CoParent coParent) {
        if (coParent == null) return null;
        return CoParentDTO.builder()
                .id(coParent.getId())
                .name(coParent.getName())
                .email(coParent.getEmail())
                .phone(coParent.getPhone())
                .relationship(coParent.getRelationship())
                .userId(coParent.getUser().getId())
                .createdAt(coParent.getCreatedAt())
                .updatedAt(coParent.getUpdatedAt())
                .build();
    }

    public static ChildDTO toChildDTO(Child child) {
        return ChildDTO.builder()
                .id(child.getId())
                .name(child.getName())
                .dateOfBirth(child.getDateOfBirth())
                .gender(child.getGender())
                .notes(child.getNotes())
                .parentId(child.getParent().getId())
                .createdAt(child.getCreatedAt())
                .updatedAt(child.getUpdatedAt())
                .build();
    }

    public static List<ChildDTO> toChildDTOList(List<Child> children) {
        return children.stream()
                .map(UserFamilyMapper::toChildDTO)
                .collect(Collectors.toList());
    }
}
