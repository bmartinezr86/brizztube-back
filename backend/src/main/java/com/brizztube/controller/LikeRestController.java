package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brizztube.response.LikeResponseRest;
import com.brizztube.services.ILikeService;

@CrossOrigin(origins = { "http://localhost:4200" }) // angular
@RestController
@RequestMapping("/api/likes")
public class LikeRestController {
	@Autowired
	private ILikeService service;

	@PostMapping("/like")
	public ResponseEntity<LikeResponseRest> likeVideo(@RequestParam("videoId") Long videoId,
			@RequestParam("userId") Long userId) {

		ResponseEntity<LikeResponseRest> response = service.likeVideo(videoId, userId);
		return response;
	}
	
	@DeleteMapping("/unlike")
	public ResponseEntity<LikeResponseRest> unLikeVideo(@RequestParam("videoId") Long videoId,
			@RequestParam("userId") Long userId) {

		ResponseEntity<LikeResponseRest> response = service.unLikeVideo(videoId, userId);
		return response;
	}
}
