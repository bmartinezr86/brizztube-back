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
import com.brizztube.model.Rol;
import com.brizztube.response.RolResponseRest;
import com.brizztube.services.IRolService;

@Service
public class RolServiceImpl implements IRolService {

	@Autowired // instancia el objeto
	private IRolDao rolDao;
	
	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<RolResponseRest> search() {
		RolResponseRest response = new RolResponseRest();
		try {
			List<Rol> rol = (List<Rol>) rolDao.findAll();
			
			response.getRolResponse().setRol(rol);
			response.setMetadata("Respuesta OK", "00", "Roles encontrados");
			
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al encontrar roles");
			e.getStackTrace();
			return new ResponseEntity<RolResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		return new ResponseEntity<RolResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<RolResponseRest> searchById(Long id) {
		RolResponseRest response = new RolResponseRest();
		List<Rol> list = new ArrayList<>();
		
		try {
			Optional<Rol> rol = rolDao.findById(id);
			
			if(rol.isPresent()) {
				list.add(rol.get());
				response.getRolResponse().setRol(list);
				response.setMetadata("Respuesta OK", "00", "Rol encontrado");
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar por id");
			e.getStackTrace();
			return new ResponseEntity<RolResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<RolResponseRest>(response, HttpStatus.OK);
	}

}
