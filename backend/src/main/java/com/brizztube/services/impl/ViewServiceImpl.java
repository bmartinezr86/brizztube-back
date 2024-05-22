package com.brizztube.services.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
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

	        try {
	            // Buscar el video por su ID
	            Optional<Video> optionalVideo = videoDao.findById(videoId);
	            if (optionalVideo.isPresent()) {
	                Video video = optionalVideo.get();
	                
	                // Revisar esto que no tiene pinta de estar bien
	                video.setTotalViews(video.getTotalViews() + 1);
	                videoDao.save(video);
	                
	                response.setMetadata("Respuesta OK", "00", "Visita registrada con éxito");
	                return new ResponseEntity<>(response, HttpStatus.OK);
	            } else {
	                response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            }
	        } catch (Exception e) {
	            response.setMetadata("Respuesta NOK", "-1", "Error al registrar la visita");
	            e.printStackTrace();
	            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }


	
	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<ViewResponseRest> getUserViewHistory(Long userId) {
		ViewResponseRest response = new ViewResponseRest();
	    List<View> viewHistory = new ArrayList<>();

	    try {
	        // Buscar las vistas del usuario por su ID, ordenadas por la fecha de acceso descendente
	        List<View> userViews = viewDao.findByUserIdOrderByLastAccessDesc(userId);

	        if (!userViews.isEmpty()) {
	            viewHistory.addAll(userViews);
	            response.getViewResponse().setView(viewHistory);
	            response.setMetadata("Respuesta OK", "00", "Historial de vistas obtenido con éxito");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "El usuario no tiene historial de vistas");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al obtener el historial de vistas del usuario");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
    @Transactional(readOnly = true)
    public ResponseEntity<ViewResponseRest> getTotalViewForVideo(Long videoId) {
        ViewResponseRest response = new ViewResponseRest();

        try {
            // Buscar el video por su ID
            Optional<Video> optionalVideo = videoDao.findById(videoId);
            if (optionalVideo.isPresent()) {
                Video video = optionalVideo.get();
                
                // Obtener el total de visitas del video
                Long totalViews = video.getTotalViews();
                
                // Establecer la respuesta con el total de visitas
                response.setTotalViews(totalViews);
                response.setMetadata("Respuesta OK", "00", "Total de visitas obtenido con éxito");
                
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al obtener el total de visitas del video");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
	}

}
