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
	public ResponseEntity<VideoResponseRest> save(Video video, MultipartFile videoFile, MultipartFile thumnailFile,
			Long categoryId, Long userId);
	public ResponseEntity<VideoResponseRest> update(MultipartFile videoFile, MultipartFile thumbnailFile,
			String title, String description, Long categoryId, Long userId, Long videoId) throws IOException;
	public ResponseEntity<VideoResponseRest> delete (Long id);
	public String saveFile(MultipartFile file, String uploadPath) throws IOException;
	public String constructFileUrl(String fileName, String basePath);
	
}
