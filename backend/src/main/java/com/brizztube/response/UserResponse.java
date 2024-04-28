package com.brizztube.response;

import java.util.List;

import com.brizztube.model.User;

import lombok.Data;

@Data
public class UserResponse {
	private List<User> user;
}
