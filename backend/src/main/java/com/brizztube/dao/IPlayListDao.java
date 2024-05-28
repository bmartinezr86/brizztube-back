package com.brizztube.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;


import com.brizztube.model.PlayList;

public interface IPlayListDao extends CrudRepository<PlayList, Long>{
	List<PlayList> findByUser_Id(Long userId);
	List<PlayList> findByVideos_Id(Long videoId);
}
