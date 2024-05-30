package com.brizztube.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brizztube.model.PlayList;
import com.brizztube.model.User;
import com.brizztube.response.PlayListResponseRest;
import com.brizztube.response.UserResponseRest;
import com.brizztube.services.IPlayListService;


@RestController
@RequestMapping("/api/playlists")
public class PlayListRestController {

	@Autowired
	private IPlayListService service;
	
	@PostMapping("/create")
	public ResponseEntity<PlayListResponseRest> createList(@RequestParam("name") String name, @RequestParam("userId") Long userId) {

		PlayList playlist = new PlayList();
		playlist.setName(name);
		ResponseEntity<PlayListResponseRest> response = service.createPlaylist(playlist, userId);
		return response;
	}
	
	@PutMapping("/modify/{id}")
	public ResponseEntity<PlayListResponseRest> modifyList(@PathVariable("id") Long playlistId, @RequestParam("userId") Long userId, @RequestParam("name") String name) {

		PlayList playlist = new PlayList();
		playlist.setName(name);
		ResponseEntity<PlayListResponseRest> response = service.modifyPlaylist(playlist, playlistId,userId);
		return response;
	}
	
	@PostMapping("/{playlistId}/videos/{videoId}")
    public ResponseEntity<PlayListResponseRest> addVideoToPlaylist(
    		 @PathVariable Long playlistId, 
             @PathVariable Long videoId) {
		ResponseEntity<PlayListResponseRest> response = service.addVideoToPlaylist(playlistId, videoId);
        return response;
    }
	
	@DeleteMapping("/{playlistId}/videos/{videoId}")
    public ResponseEntity<PlayListResponseRest> removeVideoFromPlaylist(
            @PathVariable Long playlistId, 
            @PathVariable Long videoId) {
		
		ResponseEntity<PlayListResponseRest> response = service.removeVideoToPlaylist(playlistId, videoId);
        return response;
    }
	
	@DeleteMapping("/{playlistId}")
    public ResponseEntity<PlayListResponseRest> deletePlaylist(
            @PathVariable Long playlistId) {

        return service.deletePlaylist(playlistId);
    }
	
	
	@GetMapping("/{playlistId}/videos")
    public ResponseEntity<PlayListResponseRest> listVideosByPlaylistId(@PathVariable Long playlistId) {
		ResponseEntity<PlayListResponseRest> response = service.listVideosByPlaylistId(playlistId);
        return response;
    }
	
	@GetMapping("/user/{userId}")
    public ResponseEntity<PlayListResponseRest> getPlaylistsByUserId(@PathVariable Long userId) {
		ResponseEntity<PlayListResponseRest> response = service.getPlaylistsByUserId(userId);
        return response;
    }
	
}
