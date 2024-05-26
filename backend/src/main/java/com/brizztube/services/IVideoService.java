package com.brizztube.services;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.brizztube.model.Video;
import com.brizztube.response.VideoResponseRest;

public interface IVideoService {
	public ResponseEntity<VideoResponseRest> search();

	public ResponseEntity<VideoResponseRest> searchByTitle(String title);

	public ResponseEntity<VideoResponseRest> searchByCategoryId(Long categoryId);

	public ResponseEntity<VideoResponseRest> searchByUserId(Long userId);

	public ResponseEntity<VideoResponseRest> searchById(Long videoId);

	public ResponseEntity<VideoResponseRest> uploadVideo(MultipartFile videoFile, Long userId);

	public ResponseEntity<VideoResponseRest> saveDetails(Long videoId, String title, String description,
			MultipartFile thumbnailFile, Long categoryId);

	public ResponseEntity<VideoResponseRest> update(MultipartFile videoFile, MultipartFile thumbnailFile, String title,
			String description, Long categoryId, Long userId, Long videoId) throws IOException;

	public ResponseEntity<VideoResponseRest> delete(Long id);

	public String saveFile(MultipartFile file, String uploadDir) throws IOException;

	public String getFileUrl(Long videoId, String uploadDir);

}
