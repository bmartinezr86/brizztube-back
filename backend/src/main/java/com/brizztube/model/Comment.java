package com.brizztube.model;

import java.sql.Timestamp;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "comments")
public class Comment {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String text;

	    private Timestamp date;

	    @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;

	    @ManyToOne
	    @JoinColumn(name = "video_id")
	    private Video video;

	    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL)
	    private List<CommentReply> replies;

}
