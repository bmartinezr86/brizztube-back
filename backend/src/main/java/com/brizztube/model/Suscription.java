package com.brizztube.model;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "suscriptions")
public class Suscription {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY) // Optional optimization for large datasets
    @JoinColumn(name = "subscriber_id", nullable = false)
    private User subscriber; // The user who subscribed

    @ManyToOne(fetch = FetchType.LAZY) // Optional optimization for large datasets
    @JoinColumn(name = "subscribed_to_id", nullable = false)
    private User subscribedTo; // The user being subscribed to
    
	@Column(name = "date", nullable = false)
	private Timestamp createdAt = new Timestamp(System.currentTimeMillis());
   	
	public boolean isSubscribedTo(User user) {
        return this.subscribedTo != null && this.subscribedTo.equals(user);
    }
    

}
