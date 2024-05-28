package com.brizztube.services.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.brizztube.dao.IRolDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IUserStatusDao;
import com.brizztube.model.Rol;
import com.brizztube.model.User;
import com.brizztube.model.UserStatus;
import com.brizztube.model.Video;
import com.brizztube.response.UserResponseRest;

import com.brizztube.services.IUserService;
import com.brizztube.utils.Util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired // instancia el objeto
	private IUserDao userDao;

	@Autowired // instancia el objeto
	private IUserStatusDao userStatusDao;

	@Autowired // instancia el objeto
	private IRolDao rolDao;

	@Autowired
	private SuscriptionServiceImpl suscriptionService;
	
	@Autowired
	private VideoServiceImpl videoService;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private HttpServletRequest httpServletRequest;

	@Value("${upload.avatar.path}")
	private String avatarUploadPath; // obtenemos la ruta del properties

	private Path rootLocation;

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserResponseRest> search() {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();
		List<User> listAux = new ArrayList<>();

		try {

			// search users
			listAux = (List<User>) userDao.findAll();
			if (listAux.size() > 0) {
				listAux.forEach((u) -> {
					try {
						Hibernate.initialize(u.getRol());
						Hibernate.initialize(u.getStatus());

						u.setPicture(getFileUrl(u.getId(), avatarUploadPath));
						list.add(u);
					} catch (Exception e) {
						// Manejar la excepción de descompresión de la imagen
						response.setMetadata("Respuesta NOK", "-1", "Error al recuperar los datos");
						e.printStackTrace();
						// Puedes optar por omitir este usuario con problemas de imagen o manejarlo de
						// otra manera
					}
				});
			}

			response.getUserResponse().setUser(list);
			response.setMetadata("Respuesta OK", "00", "Respuesta exitosa");

		} catch (Exception e) {
			// Manejar cualquier excepción general
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar");
			e.printStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserResponseRest> searchById(Long id) {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();

		try {

			Optional<User> user = userDao.findById(id); // Es opcional por si no existiera poder validar con los metodos
														// que trae

			// Si la categoria existe
			if (user.isPresent()) {
				list.add(user.get());
				response.getUserResponse().setUser(list);
				response.setMetadata("Respuesta OK", "00", "Usuario encontrado");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Usuario no encontrado");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar por id");
			e.getStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserResponseRest> searchByName(String name) {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();
		List<User> listAux = new ArrayList<>();

		try {
			// search user by name
			listAux = userDao.findByNameContainingIgnoreCase(name);

			// Descomprime picture in all users
			if (listAux.size() > 0) {
				listAux.stream().forEach((u) -> {
					Hibernate.initialize(u.getRol());
					Hibernate.initialize(u.getStatus());

					u.setPicture(getFileUrl(u.getId(), avatarUploadPath));
					list.add(u);
				});

				response.getUserResponse().setUser(list);
				response.setMetadata("Respuesta OK", "00", "Usuarios encontrado");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Usuarios no encontrado");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al buscar usuario por nombre");
			e.getStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<UserResponseRest> save(User user, MultipartFile avatarFile, Long rolId, Long userStatusId) {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();

		try {

			// search rol to set in the user
			Optional<Rol> rol = rolDao.findById(rolId); // Es opcional por si no existiera poder validar con los metodos
														// que trae

			if (rol.isPresent()) {
				user.setRol(rol.get());
			} else {
				response.setMetadata("Respuesta NOK", "-1", "No existe el rol asociado al usuario");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// search user-status to set in the user
			Optional<UserStatus> userStatus = userStatusDao.findById(userStatusId); // Es opcional por si no existiera
																					// poder validar con los metodos
			// que trae
			if (userStatus.isPresent()) {
				user.setStatus(userStatus.get());
			} else {
				response.setMetadata("Respuesta NOK", "-1", "No existe el estado asociado al usuario");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Check if the email is already in use
			if (userDao.existsByEmail(user.getEmail())) {
				response.setMetadata("Respuesta NOK", "-1", "El correo electrónico ya está en uso");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.BAD_REQUEST);
			}

			// Encrypt user password
			String encryptedPassword = passwordEncoder.encode(user.getPassword());
			user.setPassword(encryptedPassword);

			// Guardar archivo de miniatura
			String avatarUri = saveFile(avatarFile, avatarUploadPath);
			user.setPicture(avatarUri);

			// save user
			User userSaved = userDao.save(user);

			if (userSaved != null) {
				list.add(userSaved);
				response.getUserResponse().setUser(list);
				response.setMetadata("Respuesta OK", "00", "Usuario creado con exito");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "El usuario no se ha podido guardar debido a un error");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al guardar el usuario");
			e.getStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	//@Transactional
	@Override
	public ResponseEntity<UserResponseRest> update(User user, Long userId, MultipartFile avatarFile, Long rolId,
			Long userStatusId) {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();

		try {
			Optional<User> userSearch = userDao.findById(userId);

			if (userSearch.isPresent()) {
				User existingUser = userSearch.get();

				// Actualizar los campos del usuario con los valores proporcionados
				existingUser.setName(user.getName());
				existingUser.setDescription(user.getDescription());
				existingUser.setEmail(user.getEmail());
				existingUser.setPassword(user.getPassword());
				existingUser.setTotalSubs(user.getTotalSubs());

				// Buscar rol para establecerlo en el usuario
				Optional<Rol> rol = rolDao.findById(rolId);
				if (rol.isPresent()) {
					existingUser.setRol(rol.get());
				} else {
					response.setMetadata("Respuesta NOK", "-1", "No existe el rol asociado al usuario");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
				}

				// Buscar estado de usuario para establecerlo en el usuario
				Optional<UserStatus> userStatus = userStatusDao.findById(userStatusId);
				if (userStatus.isPresent()) {
					existingUser.setStatus(userStatus.get());
				} else {
					response.setMetadata("Respuesta NOK", "-1", "No existe el estado asociado al usuario");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
				}

				// Verificar si el correo electrónico ya está en uso por otro usuario
				// (excluyendo al usuario que se está actualizando)
				if (userDao.existsByEmailAndIdNot(existingUser.getEmail(), userId)) {
					response.setMetadata("Respuesta NOK", "-1",
							"El correo electrónico ya está en uso por otro usuario");
					return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
				}

				// Guardar el archivo de avatar si se proporciona uno nuevo
				if (avatarFile != null) {
					String avatarUri = saveFile(avatarFile, avatarUploadPath);
					existingUser.setPicture(avatarUri);
				}

				// Guardar la actualización del usuario
				User updatedUser = userDao.save(existingUser);

				if (updatedUser != null) {
					list.add(updatedUser);
					response.getUserResponse().setUser(list);
					response.setMetadata("Respuesta OK", "00", "Usuario actualizado con éxito");
				} else {
					response.setMetadata("Respuesta NOK", "-1",
							"El usuario no se ha podido actualizar debido a un error");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.BAD_REQUEST);
				}
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al actualizar el usuario");
			e.printStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<UserResponseRest> delete(Long id) {
		UserResponseRest response = new UserResponseRest();
		try {
			Optional<User> optionalUser = userDao.findById(id);
			if (optionalUser.isPresent()) {
				User user = optionalUser.get();

				// Eliminar las suscripciones relacionadas con el usuario
	            suscriptionService.deleteSubscriptionsByUserId(id);

	            // Eliminar los videos relacionados con el usuario
	            videoService.deleteVideosByUserId(id);

	            // Eliminar los archivos de la foto del usuario del sistema de archivos
	            deleteFile(user.getPicture());

	            // Eliminar el usuario de la base de datos
	            userDao.delete(user);

				response.setMetadata("Respuesta OK", "00", "Usuario eliminado correctamente");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún usuario con el ID proporcionado");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al eliminar el usuario");
			e.printStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<UserResponseRest> login(String email, String password) {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();

		try {
			// Buscar usuario por email
			Optional<User> user = userDao.findByEmail(email);

			if (user.isPresent()) {
				// Verificar la contraseña
				if (passwordEncoder.matches(password, user.get().getPassword())) {
					HttpSession session = httpServletRequest.getSession();
					session.setAttribute("user", user.get()); // establece la sesión del usuario

					list.add(user.get());
					response.getUserResponse().setUser(list);
					response.setMetadata("Respuesta OK", "00", "Inicio de sesión exitoso");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
				} else {
					response.setMetadata("Respuesta NOK", "-1", "Credenciales inválidas");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.UNAUTHORIZED);
				}
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Credenciales inválidas");
				return new ResponseEntity<UserResponseRest>(response, HttpStatus.UNAUTHORIZED);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al iniciar sesión");
			e.printStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Método auxiliar para borrar un archivo del sistema de archivos
	private void deleteFile(String filePath) {
		try {
			Files.deleteIfExists(Paths.get(filePath));
		} catch (IOException e) {
			e.printStackTrace();
			System.err.println("Error al eliminar el archivo: " + filePath);
		}
	}

	@Override
	public String saveFile(MultipartFile file, String uploadDir) throws IOException {
		String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
		byte[] bytes = file.getBytes();
		Path path = Paths.get(uploadDir).resolve(uniqueFileName);
		Files.createDirectories(path.getParent()); // Asegurarse de que el directorio existe
		Files.write(path, bytes);

		String fileUri = uploadDir + "/" + uniqueFileName; // URL relativa

		return fileUri;
	}

	@Override
	public String getFileUrl(Long userId, String uploadDir) {
		User user = userDao.findById(userId).orElse(null);
		if (user == null) {
			return null;
		}

		String fileLocation;
		if (uploadDir.equals(avatarUploadPath)) {
			fileLocation = user.getPicture();
		} else {
			return null;
		}

		try {
			Path path = Paths.get(fileLocation);
			return path.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
