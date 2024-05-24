package com.brizztube.response;

import java.util.List;

import com.brizztube.model.Like;

import lombok.Data;

@Data
public class LikeResponse {
	private List<Like> like;
}
