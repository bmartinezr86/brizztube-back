package com.brizztube.dao;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.PlaybackHistory;

public interface IPlaybackHistoryDao extends CrudRepository<PlaybackHistory, Long>{

}
