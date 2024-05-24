package com.brizztube.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.Like;

public interface ILikeDao extends CrudRepository<Like, Long>{
	List<Like> findByUserIdAndVideoId(Long userId, Long videoId);
}
