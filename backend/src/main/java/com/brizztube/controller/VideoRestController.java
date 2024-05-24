package com.brizztube.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.brizztube.model.Video;
import com.brizztube.response.UserResponseRest;
import com.brizztube.response.VideoResponseRest;
import com.brizztube.services.IVideoService;

@CrossOrigin(origins = { "http://localhost:4200" }) // angular
@RestController
@RequestMapping("/api/videos")
public class VideoRestController {

	@Autowired
	private IVideoService service;

	/**
	 * upload video
	 * 
	 * @param title
	 * @param description
	 * @param categoryId
	 * @param userId
	 * @param videoFile
	 * @param thumbnailFile
	 * @return
	 */
	@PostMapping("/upload")
	public ResponseEntity<VideoResponseRest> uploadVideo(@RequestParam("title") String title,
			@RequestParam("description") String description, @RequestParam("categoryId") Long categoryId,
			@RequestParam("userId") Long userId, @RequestParam("videoFile") MultipartFile videoFile,
			@RequestParam("thumbnailFile") MultipartFile thumbnailFile) {

		Video video = new Video();
		video.setTitle(title);
		video.setDescription(description);

		ResponseEntity<VideoResponseRest> response = service.save(video, videoFile, thumbnailFile, categoryId, userId);
		return response;
	}

	/**
	 * get all videos
	 * 
	 * @return
	 */
	@GetMapping("/")
	public ResponseEntity<VideoResponseRest> searchVideos() {

		ResponseEntity<VideoResponseRest> response = service.search();
		return response;
	}

	/**
	 * get video by title
	 * 
	 * @param title
	 * @return
	 */

	@GetMapping("/filter/title/{title}")
	public ResponseEntity<VideoResponseRest> searchByName(@PathVariable String title) {

		ResponseEntity<VideoResponseRest> response = service.searchByTitle(title);
		return response;
	}

	/**
	 * get video by categoryId
	 * 
	 * @param categoryId
	 * @return
	 */

	@GetMapping("/filter/category/{categoryId}")
	public ResponseEntity<VideoResponseRest> searchByCategoryId(@PathVariable Long categoryId) {

		ResponseEntity<VideoResponseRest> response = service.searchByCategoryId(categoryId);
		return response;
	}
	

	/**
	 * get video by userId
	 * 
	 * @param userId
	 * @return
	 */

	@GetMapping("/filter/user/{userId}")
	public ResponseEntity<VideoResponseRest> searchByUserId(@PathVariable Long userId) {

		ResponseEntity<VideoResponseRest> response = service.searchByUserId(userId);
		return response;
	}

	
	/**
	 * get video by videoId
	 * 
	 * @param videoId
	 * @return
	 */

	@GetMapping("/filter/id/{videoId}")
	public ResponseEntity<VideoResponseRest> searchById(@PathVariable Long videoId) {
		ResponseEntity<VideoResponseRest> response = service.searchById(videoId);
		return response;
	}

	/**
	 * delete video
	 * 
	 * @param id
	 * @return
	 * @throws IOException
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<VideoResponseRest> update(@PathVariable("id") Long id) throws IOException {
		ResponseEntity<VideoResponseRest> response = service.delete(id);
		return response;
	}
	
	@PutMapping("/update/{videoId}")
    public ResponseEntity<VideoResponseRest> updateVideo(
            @PathVariable Long videoId,
            @RequestParam(required = false) MultipartFile thumbnailFile,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Long categoryId,
            @RequestParam Long userId
    ) {
        try {
            ResponseEntity<VideoResponseRest> response = service.update(null, thumbnailFile, title, description, categoryId, userId, videoId);
            return response;
        } catch (IOException e) {
            e.printStackTrace();
            VideoResponseRest errorResponse = new VideoResponseRest();
            errorResponse.setMetadata("Respuesta NOK", "-1", "Error al procesar la solicitud");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
