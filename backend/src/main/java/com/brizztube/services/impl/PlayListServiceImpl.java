package com.brizztube.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.brizztube.dao.IPlayListDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.model.PlayList;
import com.brizztube.response.PlayListResponseRest;
import com.brizztube.services.IPlayListService;

public class PlayListServiceImpl implements IPlayListService {
	
	@Autowired // instancia el objeto
	private IUserDao userDao;
	
	@Autowired // instancia el objeto
	private IPlayListDao playlistDao;


	@Override
	public ResponseEntity<PlayListResponseRest> createPlaylist(PlayList playlist) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<PlayListResponseRest> addVideoToPlaylist(Long playlistId, Long vídeoId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<PlayListResponseRest> removeVideoToPlaylist(Long playlistId, Long vídeoId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ResponseEntity<PlayListResponseRest> deletePlaylist(Long playlistId) {
		// TODO Auto-generated method stub
		return null;
	}

}
