package com.brizztube.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.brizztube.model.User;
import com.brizztube.response.UserResponseRest;
import com.brizztube.services.IUserService;
import com.brizztube.utils.Util;

@CrossOrigin(origins = { "http://localhost:4200" }) // angular
@RestController
@RequestMapping("/api/")
public class UserRestController {

	@Autowired
	private IUserService service;

	/**
	 * get all users
	 * 
	 * @return
	 */
	@GetMapping("/users")
	public ResponseEntity<UserResponseRest> searchCategories() {

		ResponseEntity<UserResponseRest> response = service.search();
		return response;
	}

	/**
	 * get user by id
	 * 
	 * @param id
	 * @return
	 */

	@GetMapping("/users/{id}")
	public ResponseEntity<UserResponseRest> searchUserStatusById(@PathVariable Long id) {

		ResponseEntity<UserResponseRest> response = service.searchById(id);
		return response;
	}

	/**
	 * save user
	 * 
	 * @param picture
	 * @param name
	 * @param description
	 * @param email
	 * @param password
	 * @param rolId
	 * @param userStatusId
	 * @return
	 * @throws IOException
	 */
	@PostMapping("/users")
	public ResponseEntity<UserResponseRest> save(@RequestParam("picture") MultipartFile picture,
			@RequestParam("name") String name, @RequestParam("description") String description,
			@RequestParam("email") String email, @RequestParam("password") String password,
			@RequestParam("rol") Long rolId, @RequestParam("status") Long userStatusId) throws IOException {

		User user = new User();
		user.setName(name);
		user.setDescription(description);
		user.setEmail(email);
		user.setPassword(password);
		user.setPicture(Util.compressZLib(picture.getBytes()));

		ResponseEntity<UserResponseRest> response = service.save(user, rolId, userStatusId);
		return response;
	}

	/**
	 * update user
	 * 
	 * @param picture
	 * @param name
	 * @param description
	 * @param email
	 * @param password
	 * @param rolId
	 * @param userStatusId
	 * @return
	 * @throws IOException
	 */
	@PutMapping("/users/{id}")
	public ResponseEntity<UserResponseRest> update(@PathVariable("id") Long userId,
			@RequestParam("picture") MultipartFile picture, @RequestParam("name") String name,
			@RequestParam("description") String description, @RequestParam("email") String email,
			@RequestParam("password") String password, @RequestParam("rol") Long rolId,
			@RequestParam("status") Long userStatusId) throws IOException {

		User user = new User();
		user.setName(name);
		user.setDescription(description);
		user.setEmail(email);
		user.setPassword(password);
		user.setPicture(Util.compressZLib(picture.getBytes()));

		ResponseEntity<UserResponseRest> response = service.update(user, userId, rolId, userStatusId);
		return response;
	}
	
	
	/**
	 *  delete user
	 * @param id
	 * @return
	 * @throws IOException
	 */
	@DeleteMapping("/users/{id}")
	public ResponseEntity<UserResponseRest> update(@PathVariable("id") Long id) throws IOException {
		ResponseEntity<UserResponseRest> response = service.delete(id);
		return response;
	}

}
