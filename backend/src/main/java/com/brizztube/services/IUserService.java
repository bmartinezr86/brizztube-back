package com.brizztube.services;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.brizztube.model.User;
import com.brizztube.response.UserResponseRest;

public interface IUserService {
	public ResponseEntity<UserResponseRest> search();
	public ResponseEntity<UserResponseRest> searchById (Long id);
	public ResponseEntity<UserResponseRest> searchByName (String name);
	//public ResponseEntity<UserResponseRest> getPictureById (Long id);
	public ResponseEntity<UserResponseRest> save (User user, MultipartFile avatarFile, Long rolId, Long userStatusId);
	public ResponseEntity<UserResponseRest> update(User user, Long userId, MultipartFile avatarFile, Long rolId, Long userStatusId);
	public ResponseEntity<UserResponseRest> delete (Long id);
	public ResponseEntity<UserResponseRest> login (String email, String password);
	public String getFileUrl(Long userId, String uploadDir);
	public String saveFile(MultipartFile file, String uploadDir) throws IOException;
}
