package com.coparent.calendar.utility;

import com.coparent.calendar.dto.UserResponse;
import com.coparent.calendar.entity.User;

public class UserMapper {

	public static UserResponse convertToUserResponse(User user) {
		return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail()).role(user.getRole())
				.color(user.getColor()).build();
	}

}
