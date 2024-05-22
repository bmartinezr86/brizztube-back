package com.brizztube.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.View;

public interface IViewDao extends CrudRepository<View, Long>{
	List<View> findByUserIdOrderByLastAccessDesc(Long userId);
}
