package com.brizztube.services;

import org.springframework.http.ResponseEntity;
import com.brizztube.response.UserStatusResponseRest;

public interface IUserStatusService {
	public ResponseEntity<UserStatusResponseRest> search();
	public ResponseEntity<UserStatusResponseRest> searchById (Long id);
}
