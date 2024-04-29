package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brizztube.response.UserResponseRest;
import com.brizztube.services.IUserService;

@CrossOrigin(origins = {"http://localhost:4200"}) // angular
@RestController
@RequestMapping("/api/")
public class UserRestController {

	@Autowired
	private IUserService service;
	
	/**
	 *  get all users
	 * @return
	 */
	@GetMapping("/users")
	public ResponseEntity<UserResponseRest> searchCategories() {
		
		ResponseEntity<UserResponseRest> response = service.search();
		return response;
	}
	
	/**
	 * get user by id
	 * @param id
	 * @return
	 */
	
	@GetMapping("/users/{id}")
	public ResponseEntity<UserResponseRest> searchUserStatusById(@PathVariable Long id) {
		
		ResponseEntity<UserResponseRest> response = service.searchById(id);
		return response;
	}
}
