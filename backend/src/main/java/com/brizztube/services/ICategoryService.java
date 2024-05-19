package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.response.CategoryResponseRest;

public interface ICategoryService {
	public ResponseEntity<CategoryResponseRest> search();
	public ResponseEntity<CategoryResponseRest> searchById (Long id);
}
