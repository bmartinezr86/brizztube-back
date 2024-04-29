package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.brizztube.response.UserStatusResponseRest;
import com.brizztube.services.IUserStatusService;

@CrossOrigin(origins = {"http://localhost:4200"}) // angular
@RestController
@RequestMapping("/api/")
public class UserStatusRestController {
	
	@Autowired
	private IUserStatusService service;
	
	/**
	 *  get all user-status
	 * @return
	 */
	@GetMapping("/user-status")
	public ResponseEntity<UserStatusResponseRest> searchCategories() {
		
		ResponseEntity<UserStatusResponseRest> response = service.search();
		return response;
	}
	
	/**
	 * get rol by id
	 * @param id
	 * @return
	 */
	
	@GetMapping("/user-status/{id}")
	public ResponseEntity<UserStatusResponseRest> searchUserStatusById(@PathVariable Long id) {
		
		ResponseEntity<UserStatusResponseRest> response = service.searchById(id);
		return response;
	}
}
