package com.brizztube.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.IUserDao;
import com.brizztube.model.User;
import com.brizztube.response.UserResponseRest;

import com.brizztube.services.IUserService;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired // instancia el objeto
	private IUserDao UserDao;

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserResponseRest> search() {
		UserResponseRest response = new UserResponseRest();

		try {
			List<User> User = (List<User>) UserDao.findAll();

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
			
			Optional<User> user = UserDao.findById(id); // Es opcional por si no existiera poder validar con los metodos que trae
			
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

}
