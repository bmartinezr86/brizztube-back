package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.response.LikeResponseRest;

public interface ILikeService {
	public ResponseEntity<LikeResponseRest> likeVideo(Long videoId, Long userId);
	public ResponseEntity<LikeResponseRest> unLikeVideo(Long videoId, Long userId);
}
