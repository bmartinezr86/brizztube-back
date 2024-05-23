package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.brizztube.response.ViewResponseRest;
import com.brizztube.services.IViewService;

@CrossOrigin(origins = { "http://localhost:4200" }) // angular
@RestController
@RequestMapping("/api/views")
public class ViewRestController {
	
	@Autowired
	private IViewService service;

	/**
	 * regist visit on video
	 * @param videoId
	 * @param userId
	 * @return
	 */
	@PostMapping("/register-view")
	public ResponseEntity<ViewResponseRest> registerView(	
			@RequestParam("videoId") Long videoId,
			@RequestParam("userId") Long userId) {

		ResponseEntity<ViewResponseRest> response = service.registerView(videoId,userId);
		return response;
	}
}
