package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.response.ViewResponseRest;

public interface IViewService {
	public ResponseEntity<ViewResponseRest> registerView(Long videoId, Long userId);
	public ResponseEntity<ViewResponseRest> getUserViewHistory(Long userId);
}
