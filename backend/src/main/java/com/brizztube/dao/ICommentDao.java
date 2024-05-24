package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.Comment;

public interface ICommentDao extends CrudRepository<Comment, Long>{

}
