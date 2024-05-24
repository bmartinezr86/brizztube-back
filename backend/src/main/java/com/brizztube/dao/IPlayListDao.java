package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;


import com.brizztube.model.PlayList;

public interface IPlayListDao extends CrudRepository<PlayList, Long>{

}
