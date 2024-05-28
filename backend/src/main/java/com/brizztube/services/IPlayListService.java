package com.brizztube.services;

import org.springframework.http.ResponseEntity;

import com.brizztube.model.PlayList;
import com.brizztube.response.PlayListResponseRest;


public interface IPlayListService {
	public ResponseEntity<PlayListResponseRest> createPlaylist(PlayList playlist);
	public ResponseEntity<PlayListResponseRest> addVideoToPlaylist(Long playlistId, Long vídeoId);
	public ResponseEntity<PlayListResponseRest> removeVideoToPlaylist(Long playlistId, Long vídeoId);
	public ResponseEntity<PlayListResponseRest> deletePlaylist(Long playlistId);
	
}
