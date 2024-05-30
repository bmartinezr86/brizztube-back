package com.brizztube.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.brizztube.model.Video;
import com.brizztube.model.View;

public interface IVideoDao extends CrudRepository<Video, Long> {
	List<Video> findByTitleContainingIgnoreCase(String title);

	List<Video> findByCategoryId(Long categoryId);

	List<Video> findByUserId(Long userId);

	@Query("SELECT v FROM Video v WHERE v.user IN (SELECT s.subscribedTo FROM Suscription s WHERE s.subscriber.id = :userId)")
    List<Video> findByFollowingUsers(@Param("userId") Long userId);
	
	 List<Video> findByUserIdIn(List<Long> userIds);
}
