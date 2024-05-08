package com.brizztube.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.IUserStatusDao;
import com.brizztube.model.UserStatus;
import com.brizztube.response.UserStatusResponseRest;
import com.brizztube.services.IUserStatusService;

@Service
public class UserStatusServiceImpl implements IUserStatusService {
	@Autowired // instancia el objeto
	private IUserStatusDao UserStatusDao;
	
	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserStatusResponseRest> search() {
		UserStatusResponseRest response = new UserStatusResponseRest();
		
		try {
			List<UserStatus> UserStatus = (List<UserStatus>) UserStatusDao.findAll();
			
			response.getUserStatusResponse().setUserStatus(UserStatus);
			response.setMetadata("Respuesta OK", "00", "Respuesta exitosa");
			
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar");
			e.getStackTrace();
			return new ResponseEntity<UserStatusResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		return new ResponseEntity<UserStatusResponseRest>(response, HttpStatus.OK);
		
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<UserStatusResponseRest> searchById(Long id) {
		UserStatusResponseRest response = new UserStatusResponseRest();
		List<UserStatus> list = new ArrayList<>();
		
		try {
			
			Optional<UserStatus> userStatus = UserStatusDao.findById(id); // Es opcional por si no existiera poder validar con los metodos que trae
			
			// Si la categoria existe
			if (userStatus.isPresent()) {
				list.add(userStatus.get());
				response.getUserStatusResponse().setUserStatus(list);
				response.setMetadata("Respuesta OK", "00", "Estado de usuario encontrado");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Estado de usuario no encontrado");
				return new ResponseEntity<UserStatusResponseRest>(response, HttpStatus.NOT_FOUND);
			}
			
			
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar por id");
			e.getStackTrace();
			return new ResponseEntity<UserStatusResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		return new ResponseEntity<UserStatusResponseRest>(response, HttpStatus.OK);
	}
	
}
