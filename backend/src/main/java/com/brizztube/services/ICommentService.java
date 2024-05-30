package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.Comment;
import com.brizztube.response.CommentResponseRest;

public interface ICommentService {
    ResponseEntity<CommentResponseRest> save(Comment comment, Long videoId, Long userId);
    ResponseEntity<CommentResponseRest> delete(Long id);
    ResponseEntity<CommentResponseRest> findByVideoId(Long videoId);
    ResponseEntity<CommentResponseRest> update(Long commentId, Comment updatedComment);
}
