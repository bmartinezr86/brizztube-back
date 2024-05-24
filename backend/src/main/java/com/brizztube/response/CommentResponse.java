package com.brizztube.response;

import java.util.List;

import com.brizztube.model.Comment;

import lombok.Data;

@Data
public class CommentResponse {
	private List<Comment> comment;
}
