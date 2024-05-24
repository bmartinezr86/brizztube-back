package com.brizztube.dao;


import com.brizztube.model.Notification;
import org.springframework.data.repository.CrudRepository;

public interface INotificationDao extends CrudRepository<Notification, Long>{

}
