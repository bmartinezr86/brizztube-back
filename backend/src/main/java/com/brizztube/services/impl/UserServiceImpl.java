package com.brizztube.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.IRolDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IUserStatusDao;
import com.brizztube.model.Rol;
import com.brizztube.model.User;
import com.brizztube.model.UserStatus;
import com.brizztube.response.UserResponseRest;

import com.brizztube.services.IUserService;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired // instancia el objeto
	private IUserDao userDao;

	@Autowired // instancia el objeto
	private IUserStatusDao userStatusDao;

	@Autowired // instancia el objeto
	private IRolDao rolDao;

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserResponseRest> search() {
		UserResponseRest response = new UserResponseRest();

		try {
			List<User> User = (List<User>) userDao.findAll();

			response.getUserResponse().setUser(User);
			response.setMetadata("Respuesta OK", "00", "Respuesta exitosa");

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar");
			e.getStackTrace();
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
	@Transactional
	public ResponseEntity<UserResponseRest> save(User user, Long rolId, Long userStatusId) {
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

	@Override
	@Transactional
	public ResponseEntity<UserResponseRest> update(User user,Long userId, Long rolId, Long userStatusId) {
		UserResponseRest response = new UserResponseRest();
		List<User> list = new ArrayList<>();

		try {
			
			Optional<User> userSearch = userDao.findById(userId);
			
			if (userSearch.isPresent()) {
				
				
				userSearch.get().setName(user.getName());
				userSearch.get().setDescription(user.getDescription());
				userSearch.get().setEmail(user.getEmail());
				userSearch.get().setPassword(user.getPassword());
				userSearch.get().setPicture(user.getPicture());

				
				// search rol to set in the user
				Optional<Rol> rol = rolDao.findById(rolId); // Es opcional por si no existiera poder validar con los metodos
															// que trae

				if (rol.isPresent()) {
					userSearch.get().setRol(rol.get());
				} else {
					response.setMetadata("Respuesta NOK", "-1", "No existe el rol asociado al usuario");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
				}

				// search user-status to set in the user
				Optional<UserStatus> userStatus = userStatusDao.findById(userStatusId); // Es opcional por si no existiera
																						// poder validar con los metodos
				if (userStatus.isPresent()) {
					userSearch.get().setStatus(userStatus.get());
				} else {
					response.setMetadata("Respuesta NOK", "-1", "No existe el estado asociado al usuario");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.NOT_FOUND);
				}
				
				// Check if the email is already in use by another user (excluding the user being updated)
				if (userDao.existsByEmailAndIdNot(userSearch.get().getEmail(), userId)) {
	                response.setMetadata("Respuesta NOK", "-1", "El correo electrónico ya está en uso por otro usuario");
	                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
				}
				
				User userToUpdate = userDao.save(userSearch.get());
			
				if (userToUpdate != null) {
					list.add(userToUpdate);
					response.getUserResponse().setUser(list);
					response.setMetadata("Respuesta OK", "00", "Usuario actualizado con exito");
				} else {
					response.setMetadata("Respuesta NOK", "-1",
							"El usuario no se ha podido actualizar debido a un error");
					return new ResponseEntity<UserResponseRest>(response, HttpStatus.BAD_REQUEST);
				}

			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al actualizar el usuario");
			e.getStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<UserResponseRest> delete(Long id) {
		UserResponseRest response = new UserResponseRest();
		try {
			userDao.deleteById(id);
			response.setMetadata("Respuesta OK", "00", "El usuario se ha eliminado correctamente");

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al eliminar el usuario");
			e.getStackTrace();
			return new ResponseEntity<UserResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<UserResponseRest>(response, HttpStatus.OK);
	}

}