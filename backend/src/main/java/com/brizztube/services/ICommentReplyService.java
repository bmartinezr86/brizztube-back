package com.brizztube.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.Comment;
import com.brizztube.model.CommentReply;
import com.brizztube.response.CommentReplyResponseRest;
import com.brizztube.response.CommentResponseRest;

public interface ICommentReplyService {
	ResponseEntity<CommentReplyResponseRest> saveReply(CommentReply reply, Long commentId, Long userId);
	public ResponseEntity<CommentReplyResponseRest> updateReply(Long replyId, CommentReply updatedReply);
	public ResponseEntity<CommentReplyResponseRest> deleteReply(Long replyId);
	public ResponseEntity<CommentReplyResponseRest> getRepliesByCommentId(Long commentId);
}
