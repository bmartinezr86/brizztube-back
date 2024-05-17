package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.User;
import com.brizztube.response.UserResponseRest;

public interface IUserService {
	public ResponseEntity<UserResponseRest> search();
	public ResponseEntity<UserResponseRest> searchById (Long id);
	public ResponseEntity<UserResponseRest> searchByName (String name);
	//public ResponseEntity<UserResponseRest> getPictureById (Long id);
	public ResponseEntity<UserResponseRest> save (User user,Long rolId,Long userStatusId);
	public ResponseEntity<UserResponseRest> update (User user,Long userId, Long rolId, Long userStatusId);
	public ResponseEntity<UserResponseRest> delete (Long id);
	public ResponseEntity<UserResponseRest> login (String email, String password);
}
