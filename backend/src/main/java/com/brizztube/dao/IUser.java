package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.User;

public interface IUser extends CrudRepository<User, Long>{

}
