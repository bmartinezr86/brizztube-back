package com.brizztube.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseRest extends ResponseRest{
	private CommentResponse commentResponse= new CommentResponse();
}
