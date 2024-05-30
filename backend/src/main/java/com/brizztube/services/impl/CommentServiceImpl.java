package com.brizztube.services.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.ICommentDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IVideoDao;
import com.brizztube.model.Comment;
import com.brizztube.model.User;
import com.brizztube.model.Video;
import com.brizztube.response.CommentResponseRest;
import com.brizztube.services.ICommentService;

@Service
public class CommentServiceImpl implements ICommentService {
	
	@Autowired // instancia el objeto
	private IUserDao userDao;
	
	@Autowired
	private IVideoDao videoDao;
	
	@Autowired
	private ICommentDao commentDao;
	


	@Transactional
	@Override
    public ResponseEntity<CommentResponseRest> save(Comment comment, Long videoId, Long userId) {
        CommentResponseRest response = new CommentResponseRest();
        List<Comment> list = new ArrayList<>();

        try {
            User user = userDao.findById(userId).orElse(null);
            Video video = videoDao.findById(videoId).orElse(null);

            if (user == null || video == null) {
                response.setMetadata("Respuesta NOK", "-1", "Usuario o video no encontrado");
                return new ResponseEntity<CommentResponseRest>(response, HttpStatus.NOT_FOUND);
            }

            comment.setDate(new Timestamp(System.currentTimeMillis()));
            comment.setUser(user);
            comment.setVideo(video);

            Comment savedComment = commentDao.save(comment);

            if (savedComment != null) {
            	  list.add(savedComment);
                  response.getCommentResponse().setComment(list);
                  response.setMetadata("Respuesta OK", "00", "Comentario guardado");
            } else {
            	 response.setMetadata("Respuesta NOK", "-1", "No se ha podido guardar el comentario");
            	 return new ResponseEntity<CommentResponseRest>(response, HttpStatus.BAD_REQUEST);
            }
          
           

        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al guardar el comentario");
            e.printStackTrace();
            return new ResponseEntity<CommentResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return new ResponseEntity<CommentResponseRest>(response, HttpStatus.OK);
    }
	
	@Override
	@Transactional
	public ResponseEntity<CommentResponseRest> update(Long commentId, Comment updatedComment) {
	    CommentResponseRest response = new CommentResponseRest();
	    List<Comment> list = new ArrayList<>();

	    try {
	        // Buscar el comentario por su ID
	        Optional<Comment> optionalComment = commentDao.findById(commentId);
	        if (optionalComment.isPresent()) {
	            Comment existingComment = optionalComment.get();
	            
	            // Validar la existencia del usuario asociado al comentario
	            if (existingComment.getUser() == null) {
	                response.setMetadata("Respuesta NOK", "-1", "El usuario asociado al comentario no existe");
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            }

	            // Validar la existencia del video asociado al comentario
	            if (existingComment.getVideo() == null) {
	                response.setMetadata("Respuesta NOK", "-1", "El video asociado al comentario no existe");
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            }

	            // Actualizar los campos relevantes del comentario existente
	            existingComment.setText(updatedComment.getText());

	            // Guardar el comentario actualizado
	            Comment savedComment = commentDao.save(existingComment);

	            if (savedComment != null) {
	            	  list.add(savedComment);
	                  response.getCommentResponse().setComment(list);
	                  response.setMetadata("Respuesta OK", "00", "Comentario guardado");
	            } else {
	            	 response.setMetadata("Respuesta NOK", "-1", "No se ha podido guardar el comentario");
	            	 return new ResponseEntity<CommentResponseRest>(response, HttpStatus.BAD_REQUEST);
	            }
	         

	            return new ResponseEntity<>(response, HttpStatus.OK);
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "El comentario no se encontró");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al modificar el comentario");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	@Override
	public ResponseEntity<CommentResponseRest> delete(Long id) {
		CommentResponseRest response = new CommentResponseRest();

        try {
            Optional<Comment> optionalComment = commentDao.findById(id);
            if (!optionalComment.isPresent()) {
                response.setMetadata("Respuesta NOK", "-1", "Comentario no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            Comment comment = optionalComment.get();

            // Validar si el usuario y el video existen
            User user = userDao.findById(comment.getUser().getId()).orElse(null);
            Video video = videoDao.findById(comment.getVideo().getId()).orElse(null);
            if (user == null || video == null) {
                response.setMetadata("Respuesta NOK", "-1", "Usuario o video no encontrado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            // Eliminar el comentario
             commentDao.delete(comment);
            response.setMetadata("Respuesta OK", "00", "Comentario eliminado exitosamente");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al eliminar el comentario");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
	}

	@Override
    @Transactional(readOnly = true)
    public ResponseEntity<CommentResponseRest> findByVideoId(Long videoId) {
        CommentResponseRest response = new CommentResponseRest();

        try {
            List<Comment> comments = commentDao.findByVideoId(videoId);

            if (comments.isEmpty()) {
                response.setMetadata("Respuesta NOK", "-1", "No se encontraron comentarios para el video");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            response.getCommentResponse().setComment(comments);
            response.setMetadata("Respuesta OK", "00", "Comentarios encontrados exitosamente");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al obtener comentarios del video");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
