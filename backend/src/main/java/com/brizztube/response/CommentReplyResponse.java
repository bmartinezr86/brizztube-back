package com.brizztube.response;

import java.util.List;

import com.brizztube.model.CommentReply;

import lombok.Data;

@Data
public class CommentReplyResponse {
	private List<CommentReply> commentReply;
}
