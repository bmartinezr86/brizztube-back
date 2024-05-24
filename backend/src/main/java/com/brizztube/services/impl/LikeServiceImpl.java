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

import com.brizztube.dao.ILikeDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IVideoDao;
import com.brizztube.model.Like;
import com.brizztube.model.User;
import com.brizztube.model.Video;
import com.brizztube.response.LikeResponseRest;
import com.brizztube.services.ILikeService;

@Service
public class LikeServiceImpl implements ILikeService {

	
	@Autowired
    private ILikeDao likeDao;

    @Autowired
    private IVideoDao videoDao;

    @Autowired
    private IUserDao userDao;
	   @Transactional
	@Override
	public ResponseEntity<LikeResponseRest> likeVideo(Long videoId, Long userId) {
		LikeResponseRest response = new LikeResponseRest();
        List<Like> list = new ArrayList<>();

        try {
        	
        	// Buscar el usuario por su ID y asignarlo al view
            Optional<User> optionalUser = userDao.findById(userId);
            if (!optionalUser.isPresent()) {
            	 response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
	             return new ResponseEntity<LikeResponseRest>(response, HttpStatus.NOT_FOUND);
            } 
            
            // Buscar el video por su ID
            Optional<Video> optionalVideo = videoDao.findById(videoId);
            if (optionalVideo.isPresent()) {
                Video video = optionalVideo.get();
                
                // Actualiza las visitas totales del video
                video.setTotalLikes(video.getTotalLikes() + 1);
                Video videoUpdated = videoDao.save(video);
                
                // Validamos si se han actualizado correctamente las visitas totales
                
                if(videoUpdated == null) {
                	response.setMetadata("Respuesta NOK", "-1", "No se ha podido registrar el like correctamente");
    				return new ResponseEntity<LikeResponseRest>(response, HttpStatus.BAD_REQUEST);
                }        
                // Creamos el objeto de like y seteamos los campos 
                Like  like = new Like();
                like.setUser(optionalUser.get());
                like.setVideo(optionalVideo.get());
                like.setDate(new Timestamp(System.currentTimeMillis()));
                
                //Guardamos el registro del like
                Like savedLike = likeDao.save(like);
                
                // Validamos que se ha guardado correctamente el registro
                if(savedLike!= null) {
                	list.add(savedLike);
    				response.getLikeResponse().setLike(list);
    				response.setMetadata("Respuesta OK", "00", "Se ha dado like con éxito");
                } else {
                	response.setMetadata("Respuesta NOK", "-1", "No se ha podido dar like");
    				return new ResponseEntity<LikeResponseRest>(response, HttpStatus.BAD_REQUEST);
                }	                
           
            } else {
                response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
                return new ResponseEntity<LikeResponseRest>(response, HttpStatus.NOT_FOUND);
            }
            
         
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al registrar la visita");
            e.printStackTrace();
            return new ResponseEntity<LikeResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        response.setMetadata("Respuesta OK", "00", "Visita registrada con éxito");
        return new ResponseEntity<LikeResponseRest>(response, HttpStatus.OK);
	}

	   @Override
	   public ResponseEntity<LikeResponseRest> unLikeVideo(Long videoId, Long userId) {
	       LikeResponseRest response = new LikeResponseRest();
	       List<Like> list = new ArrayList<>();

	       try {
	           // Buscar el usuario por su ID
	           Optional<User> optionalUser = userDao.findById(userId);
	           if (!optionalUser.isPresent()) {
	               response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
	               return new ResponseEntity<LikeResponseRest>(response, HttpStatus.NOT_FOUND);
	           } 

	           // Buscar el video por su ID
	           Optional<Video> optionalVideo = videoDao.findById(videoId);
	           if (!optionalVideo.isPresent()) {
	               response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
	               return new ResponseEntity<LikeResponseRest>(response, HttpStatus.NOT_FOUND);
	           }

	         
	        // Buscar todos los registros de like existentes
	           List<Like> likes = likeDao.findByUserIdAndVideoId(userId, videoId);
	           if (likes.isEmpty()) {
	               response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún like para el usuario y video proporcionados");
	               return new ResponseEntity<LikeResponseRest>(response, HttpStatus.NOT_FOUND);
	           }

	        // Eliminar todos los registros del like
	           likeDao.deleteAll(likes);


	           // Decrementar el contador de likes del video
	           Video video = optionalVideo.get();
	           video.setTotalLikes(video.getTotalLikes() - 1);
	           Video videoUpdated = videoDao.save(video);

	           // Validar si se ha actualizado correctamente el contador de likes
	           if (videoUpdated == null) {
	               response.setMetadata("Respuesta NOK", "-1", "No se ha podido actualizar el contador de likes");
	               return new ResponseEntity<LikeResponseRest>(response, HttpStatus.BAD_REQUEST);
	           }

	           response.setMetadata("Respuesta OK", "00", "Se ha dado dislike con éxito");
	           return new ResponseEntity<LikeResponseRest>(response, HttpStatus.OK);

	       } catch (Exception e) {
	           response.setMetadata("Respuesta NOK", "-1", "Error al registrar la visita");
	           e.printStackTrace();
	           return new ResponseEntity<LikeResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	       }
	   }


}
