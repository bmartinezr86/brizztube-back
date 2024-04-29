package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.User;

public interface IUserDao extends CrudRepository<User, Long>{

}
