package com.brizztube.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.User;

public interface IUserDao extends CrudRepository<User, Long>{
	boolean existsByEmail(String email);
	boolean existsByEmailAndIdNot(String email, Long id);
	List<User> findByEmailContainingIgnoreCase(String email);
	List<User> findByNameContainingIgnoreCase(String name);
	Optional<User> findByEmail(String email);
}
