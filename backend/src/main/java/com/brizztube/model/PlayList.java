package com.brizztube.model;

import java.sql.Timestamp; 
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "playlists")
public class PlayList {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String name;

	    @ManyToOne
	    @JoinColumn(name = "user_id") // El usuario que creó la lista de reproducción
	    private User user;

	    @ManyToMany
	    @JoinTable(
	        name = "playlist_video",
	        joinColumns = @JoinColumn(name = "playlist_id"),
	        inverseJoinColumns = @JoinColumn(name = "video_id")
	    )
	    private List<Video> videos;

	    private Timestamp creationTimestamp;

	    private Timestamp lastModifiedTimestamp;
}
