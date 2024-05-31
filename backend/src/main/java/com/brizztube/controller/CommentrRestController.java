package com.brizztube.controller;

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

import com.brizztube.model.Comment;
import com.brizztube.response.CommentResponseRest;
import com.brizztube.services.ICommentService;

@CrossOrigin(origins = { "http://localhost:4200" }) // angular
@RestController
@RequestMapping("/api/comments")
public class CommentrRestController {
	@Autowired
	private ICommentService service;

	@PostMapping("/save")
	public ResponseEntity<CommentResponseRest> saveComment(@RequestParam Long userId, @RequestParam Long videoId,
			@RequestParam String text) {

		Comment comment = new Comment();
		comment.setText(text);
		ResponseEntity<CommentResponseRest> response = service.save(comment, videoId, userId);
		return response;
	}

	@PutMapping("/update/{commentId}")
	public ResponseEntity<CommentResponseRest> updateComment(@PathVariable Long commentId,
			@RequestParam String text) {

		Comment updatedComment = new Comment();
		updatedComment.setText(text);
		ResponseEntity<CommentResponseRest> response = service.update(commentId, updatedComment);
		return response;
	}
	
	@DeleteMapping("/delete/{commentId}")
	public ResponseEntity<CommentResponseRest> deleteComment(@PathVariable Long commentId) {
		ResponseEntity<CommentResponseRest> response = service.delete(commentId);
		return response;
	}
	
	@GetMapping("/video/{videoId}")
    public ResponseEntity<CommentResponseRest> getCommentsByVideoId(@PathVariable Long videoId) {
		
		ResponseEntity<CommentResponseRest> response = service.findByVideoId(videoId);
        return response;
    }
}
