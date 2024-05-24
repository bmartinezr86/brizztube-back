package com.brizztube.services.impl;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.brizztube.model.Comment;
import com.brizztube.response.CommentResponseRest;
import com.brizztube.services.ICommentService;

@Service
public class CommentServiceImpl implements ICommentService {

	@Override
	public ResponseEntity<CommentResponseRest> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentResponseRest> findById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentResponseRest> save(Comment comment, Long videoId, Long usuarioId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentResponseRest> deleteById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentResponseRest> findByVideoId(Long videoId) {
		// TODO Auto-generated method stub
		return null;
	}

}
