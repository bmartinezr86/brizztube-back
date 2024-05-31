package com.brizztube.services.impl;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.CommentReply;
import com.brizztube.response.CommentReplyResponseRest;
import com.brizztube.services.ICommentReplyService;

public class CommentReplyServiceImpl implements ICommentReplyService {

	@Override
	public ResponseEntity<CommentReplyResponseRest> saveReply(CommentReply reply, Long commentId, Long userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentReplyResponseRest> updateReply(Long replyId, CommentReply updatedReply) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentReplyResponseRest> deleteReply(Long replyId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<CommentReplyResponseRest> getRepliesByCommentId(Long commentId) {
		// TODO Auto-generated method stub
		return null;
	}

}
