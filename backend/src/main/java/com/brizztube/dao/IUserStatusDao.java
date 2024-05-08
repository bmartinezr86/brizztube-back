package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.UserStatus;

public interface IUserStatusDao extends CrudRepository<UserStatus, Long>{

}
