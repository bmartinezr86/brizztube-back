package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brizztube.response.RolResponseRest;
import com.brizztube.services.IRolService;

@CrossOrigin(origins = {"http://localhost:4200"}) // angular
@RestController
@RequestMapping("/api/")
public class RolRestController {
	
	
	@Autowired
	private IRolService service;
	
	/**
	 *  get all roles
	 * @return
	 */
	@GetMapping("/roles")
	public ResponseEntity<RolResponseRest> searchRoles() {
		
		ResponseEntity<RolResponseRest> response = service.search();
		return response;
	}
	
	/**
	 * get rol by id
	 * @param id
	 * @return
	 */
	
	@GetMapping("/roles/{id}")
	public ResponseEntity<RolResponseRest> searchRolesById(@PathVariable Long id) {
		
		ResponseEntity<RolResponseRest> response = service.searchById(id);
		return response;
	}
}
