package com.brizztube.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.Video;

public interface IVideoDao extends CrudRepository<Video, Long>{
	List<Video> findByTitleContainingIgnoreCase(String title);
	List<Video> findByCategoryId(Long categoryId);
	List<Video> findByUserId(Long userId);
}
