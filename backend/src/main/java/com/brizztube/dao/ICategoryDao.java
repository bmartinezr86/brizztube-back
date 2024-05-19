package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.Category;

public interface ICategoryDao extends CrudRepository<Category, Long>{

}
