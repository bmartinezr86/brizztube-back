package com.brizztube.model;

import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@Entity
@Table(name = "users")
public class User{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 35)
	private String name;

	private String description;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false, length = 255)
	private String password;

	 @Column(nullable = false, length = 255)
	 private String picture;
	 
	 @Column(name = "total_subs", nullable = false)
	 private Long totalSubs = 0L; // Inicializado a 0

	@ManyToOne // Many users can have one UserStatus
	@JoinColumn(nullable = false) // Foreign key constraint for user_status
	private UserStatus status;

	@ManyToOne // Many users can have one Rol
	@JoinColumn(name = "rol", nullable = false) // Foreign key constraint for rol
	private Rol rol;

	@Column(name = "fecha", nullable = false)
	private Timestamp createdAt = new Timestamp(System.currentTimeMillis());
	
	@JsonIgnore
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Video> videos;

}
