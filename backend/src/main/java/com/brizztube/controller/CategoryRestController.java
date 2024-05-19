package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brizztube.response.CategoryResponseRest;
import com.brizztube.services.ICategoryService;

@CrossOrigin(origins = {"http://localhost:4200"}) // angular
@RestController
@RequestMapping("/api/categories")
public class CategoryRestController {
	@Autowired
	private ICategoryService service;
	
	/**
	 *  get all categories
	 * @return
	 */
	@GetMapping("/")
	public ResponseEntity<CategoryResponseRest> searchCategory() {
		
		ResponseEntity<CategoryResponseRest> response = service.search();
		return response;
	}
	
	/**
	 * get category by id
	 * @param id
	 * @return
	 */
	
	@GetMapping("/{id}")
	public ResponseEntity<CategoryResponseRest> searchCategoriesById(@PathVariable Long id) {
		
		ResponseEntity<CategoryResponseRest> response = service.searchById(id);
		return response;
	}
}
