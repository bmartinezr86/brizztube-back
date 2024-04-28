package com.brizztube.model;

import java.sql.Timestamp;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
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

	@Lob
	@Basic(fetch = FetchType.LAZY)
	@Column(name = "picture", columnDefinition = "longblob")
	private byte[] picture;

	@ManyToOne // Many users can have one UserStatus
	@JoinColumn(nullable = false) // Foreign key constraint for user_status
	private UserStatus status;

	@ManyToOne // Many users can have one Rol
	@JoinColumn(name = "rol", nullable = false) // Foreign key constraint for rol
	private Rol rol;

	@Column(name = "fecha", nullable = false)
	private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

}
