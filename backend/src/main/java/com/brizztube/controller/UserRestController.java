package com.brizztube.controller;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
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

@CrossOrigin(origins = {"http://localhost:4200"}) // angular
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
	public ResponseEntity<UserResponseRest> searchUsers() {

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
	public ResponseEntity<UserResponseRest> searchUserById(@PathVariable Long id) {

		ResponseEntity<UserResponseRest> response = service.searchById(id);
		return response;
	}

	/**
	 * get user by name
	 * 
	 * @param name
	 * @return
	 */

	@GetMapping("/users/filter/{name}")
	public ResponseEntity<UserResponseRest> searchByName(@PathVariable String name) {

		ResponseEntity<UserResponseRest> response = service.searchByName(name);
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
	public ResponseEntity<UserResponseRest> save(@RequestParam(value="picture", required = false) MultipartFile picture,
			@RequestParam("name") String name, @RequestParam("description") String description,
			@RequestParam("email") String email, @RequestParam("password") String password,
			@RequestParam("rol") Long rolId, @RequestParam("status") Long userStatusId) throws IOException {

		User user = new User();
		user.setName(name);
		user.setDescription(description);
		user.setEmail(email);
		user.setPassword(password);
		ResponseEntity<UserResponseRest> response = service.save(user,picture, rolId, userStatusId);
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

		ResponseEntity<UserResponseRest> response = service.update(user, userId, picture, rolId, userStatusId);
		return response;
	}

	/**
	 * delete user
	 * 
	 * @param id
	 * @return
	 * @throws IOException
	 */
	@DeleteMapping("/users/{id}")
	public ResponseEntity<UserResponseRest> update(@PathVariable("id") Long id) throws IOException {
		ResponseEntity<UserResponseRest> response = service.delete(id);
		return response;
	}
	
	/**
	 * login user
	 * @param email
	 * @param password
	 * @return
	 * @throws IOException
	 */
	
	@PostMapping("/login")
	public ResponseEntity<UserResponseRest> login(@RequestParam("email") String email, @RequestParam("password") String password) throws IOException {
		ResponseEntity<UserResponseRest> response = service.login(email, password);
		return response;
	}
	
	
}
