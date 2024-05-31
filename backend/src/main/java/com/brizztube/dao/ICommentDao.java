package com.brizztube.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.Comment;

public interface ICommentDao extends CrudRepository<Comment, Long>{
	List<Comment> findByVideoId(Long videoId);
	void deleteByVideoId(Long videoId);
}
