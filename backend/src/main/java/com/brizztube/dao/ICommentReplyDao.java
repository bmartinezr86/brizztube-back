package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.CommentReply;

public interface ICommentReplyDao extends CrudRepository<CommentReply, Long>{

}
