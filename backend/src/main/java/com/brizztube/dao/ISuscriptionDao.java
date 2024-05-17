package com.brizztube.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.brizztube.model.Suscription;
import com.brizztube.model.User;

public interface ISuscriptionDao extends CrudRepository<Suscription, Long>{
	List<Suscription> findBySubscriber(User subscriber);
    List<Suscription> findBySubscribedTo(User subscribedToId);
    boolean existsBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);
    Optional<Suscription> findBySubscriberIdAndSubscribedToId(Long subscriberId, Long subscribedToId);
    Long countBySubscribedToId(Long userId);
    
}
