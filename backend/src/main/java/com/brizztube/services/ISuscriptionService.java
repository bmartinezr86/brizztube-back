package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.User;
import com.brizztube.response.SuscriptionResponseRest;

public interface ISuscriptionService {
	public ResponseEntity<SuscriptionResponseRest> subscribe(Long subscriberId, Long subscribedTo);
	public ResponseEntity<SuscriptionResponseRest>unsubscribe(Long subscriberId, Long subscribedToId);
	// public ResponseEntity<SuscriptionResponseRest>getAllSuscriptionByUserId(Long subscribedToId);
	public ResponseEntity<SuscriptionResponseRest> getSuscriptionCountByUserId(Long userId);
}
