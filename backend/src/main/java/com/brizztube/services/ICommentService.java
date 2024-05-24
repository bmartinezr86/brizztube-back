package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.Comment;
import com.brizztube.response.CommentResponseRest;

public interface ICommentService {
	ResponseEntity<CommentResponseRest> findAll();
    ResponseEntity<CommentResponseRest> findById(Long id);
    ResponseEntity<CommentResponseRest> save(Comment comment, Long videoId, Long usuarioId);
    ResponseEntity<CommentResponseRest> deleteById(Long id);
    ResponseEntity<CommentResponseRest> findByVideoId(Long videoId);
}
