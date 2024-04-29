package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.response.UserResponseRest;

public interface IUserService {
	public ResponseEntity<UserResponseRest> search();
	public ResponseEntity<UserResponseRest> searchById (Long id);
}
