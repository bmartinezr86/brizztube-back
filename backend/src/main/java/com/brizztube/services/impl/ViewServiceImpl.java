package com.brizztube.services.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IVideoDao;
import com.brizztube.dao.IViewDao;
import com.brizztube.model.User;
import com.brizztube.model.Video;
import com.brizztube.model.View;
import com.brizztube.response.ViewResponseRest;
import com.brizztube.services.IViewService;

@Service
public class ViewServiceImpl implements IViewService {

	@Autowired
	private IViewDao viewDao;

	@Autowired
	private IVideoDao videoDao;

	@Autowired
	private IUserDao userDao;

	@Override
	@Transactional
	public ResponseEntity<ViewResponseRest> registerView(Long videoId, Long userId) {
		ViewResponseRest response = new ViewResponseRest();
		List<View> list = new ArrayList<>();

		try {

			// Buscar el usuario por su ID y asignarlo al view
			Optional<User> optionalUser = userDao.findById(userId);
			if (!optionalUser.isPresent()) {
				response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
				return new ResponseEntity<ViewResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Buscar el video por su ID
			Optional<Video> optionalVideo = videoDao.findById(videoId);
			if (optionalVideo.isPresent()) {
				Video video = optionalVideo.get();

				// Actualiza las visitas totales del video
				video.setTotalViews(video.getTotalViews() + 1);
				Video videoUpdated = videoDao.save(video);

				// Validamos si se han actualizado correctamente las visitas totales

				if (videoUpdated == null) {
					response.setMetadata("Respuesta NOK", "-1",
							"No se ha podido registrar la visualizacion correctamente");
					return new ResponseEntity<ViewResponseRest>(response, HttpStatus.BAD_REQUEST);
				}
				// Creamos el objeto de view y seteamos los campos
				View view = new View();
				view.setUser(optionalUser.get());
				view.setVideo(optionalVideo.get());
				view.setLastVisitDate(new Timestamp(System.currentTimeMillis()));

				// Guardamos el registro de la visita
				View savedRegistView = viewDao.save(view);

				// Validamos que se ha guardado correctamente el registro
				if (savedRegistView != null) {
					list.add(savedRegistView);
					response.getViewResponse().setView(list);
					response.setMetadata("Respuesta OK", "00", "Usuario visualizando video con éxito");
				} else {
					response.setMetadata("Respuesta NOK", "-1", "Error al guardar el registro de visualizacion");
					return new ResponseEntity<ViewResponseRest>(response, HttpStatus.BAD_REQUEST);
				}

			} else {
				response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
				return new ResponseEntity<ViewResponseRest>(response, HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al registrar la visita");
			e.printStackTrace();
			return new ResponseEntity<ViewResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		response.setMetadata("Respuesta OK", "00", "Visita registrada con éxito");
		return new ResponseEntity<ViewResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<ViewResponseRest> getUserViewHistory(Long userId) {
		ViewResponseRest response = new ViewResponseRest();
		List<View> viewHistory = new ArrayList<>();

		try {
			// Buscar las vistas del usuario por su ID, ordenadas por la fecha de acceso
			// descendente
			List<View> userViews = viewDao.findByUserIdOrderByLastVisitDate(userId);

			if (!userViews.isEmpty()) {
				viewHistory.addAll(userViews);
				response.getViewResponse().setView(viewHistory);
				response.setMetadata("Respuesta OK", "00", "Historial de vistas obtenido con éxito");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "El usuario no tiene historial de vistas");
				return new ResponseEntity<ViewResponseRest>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al obtener el historial de vistas del usuario");
			e.printStackTrace();
			return new ResponseEntity<ViewResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<ViewResponseRest>(response, HttpStatus.OK);
	}

}
