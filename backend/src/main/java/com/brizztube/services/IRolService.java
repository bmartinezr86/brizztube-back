package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.response.RolResponseRest;

public interface IRolService {
	public ResponseEntity<RolResponseRest> search();
	public ResponseEntity<RolResponseRest> searchById (Long id);
}
