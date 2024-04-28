package com.brizztube.response;

import java.util.List;

import com.brizztube.model.UserStatus;

import lombok.Data;

@Data
public class UserStatusResponse {
	private List<UserStatus> userStatus;
}
