package com.brizztube.services.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.IPlayListDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IVideoDao;
import com.brizztube.model.PlayList;
import com.brizztube.model.User;
import com.brizztube.model.Video;
import com.brizztube.response.PlayListResponse;
import com.brizztube.response.PlayListResponseRest;
import com.brizztube.services.IPlayListService;




@Service
public class PlayListServiceImpl implements IPlayListService {
	
	@Autowired // instancia el objeto
	private IUserDao userDao;
	
	@Autowired
	private IVideoDao videoDao;
	
	@Autowired // instancia el objeto
	private IPlayListDao playlistDao;


	@Override
	@Transactional
	public ResponseEntity<PlayListResponseRest> createPlaylist(PlayList playlist, Long userId) {
		 PlayListResponseRest response = new PlayListResponseRest();
	        List<PlayList> list = new ArrayList<>();

	        try {
	            Optional<User> userOptional = userDao.findById(userId);
	            if (!userOptional.isPresent()) {
	                response.setMetadata("Respuesta NOK", "-1", "El usuario no existe.");
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            }
	            
	            User user = userOptional.get();
	            playlist.setUser(user);
	            playlist.setCreationTimestamp(new Timestamp(System.currentTimeMillis()));
	            PlayList savedPlaylist = playlistDao.save(playlist);
	            if(savedPlaylist != null) {
	            	list.add(savedPlaylist);
		            response.getPlayListResponse().setPlaylist(list);
		            response.setMetadata("Respuesta OK", "00", "Lista de reproducción creada.");
	            } else  {
	            	response.setMetadata("Respuesta NOK", "-1", "Fallo al crear la lista de reproducción.");
	 	            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	            }
	            
	          
	           
	        } catch (Exception e) {
	            response.setMetadata("Respuesta NOK", "-1", "Fallo al crear la lista de reproducción.");
	            e.printStackTrace();
	            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	        return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<PlayListResponseRest> addVideoToPlaylist(Long playlistId, Long videoId) {
		PlayListResponseRest response = new PlayListResponseRest();
	    try {
	        Optional<PlayList> optionalPlaylist = playlistDao.findById(playlistId);
	        Optional<Video> optionalVideo = videoDao.findById(videoId);

	        if (optionalPlaylist.isPresent() && optionalVideo.isPresent()) {
	            PlayList playlist = optionalPlaylist.get();
	            Video video = optionalVideo.get();

	            // Verificar si el video ya está en la lista de reproducción
	            List<Video> videos = playlist.getVideos();
	            if (videos.contains(video)) {
	                response.setMetadata("Respuesta NOK", "-1", "El video ya está en la lista de reproducción");
	                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	            }

	            // Agregar el video a la lista de reproducción
	            videos.add(video);
	            playlist.setVideos(videos);
	            playlist.setLastModifiedTimestamp(new Timestamp(System.currentTimeMillis()));
	            PlayList savedPlaylist = playlistDao.save(playlist);

	            if (savedPlaylist != null) {
	                // Crear un PlayListResponse y agregar la lista de reproducción actualizada
	                PlayListResponse playListResponse = new PlayListResponse();
	                List<PlayList> playlists = new ArrayList<>();
	                playlists.add(savedPlaylist);
	                playListResponse.setPlaylist(playlists);

	                // Establecer el PlayListResponse en el PlayListResponseRest
	                response.setPlayListResponse(playListResponse);
	                response.setMetadata("Respuesta OK", "00", "Video añadido correctamente a la lista de reproducción");
	            } else {
	                response.setMetadata("Respuesta NOK", "-1", "Error al guardar la lista de reproducción");
	                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	            }
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "No se encontró la lista de reproducción o el video");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al añadir el video a la lista de reproducción");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<PlayListResponseRest> removeVideoToPlaylist(Long playlistId, Long videoId) {
		PlayListResponseRest response = new PlayListResponseRest();
        try {
            Optional<PlayList> optionalPlaylist = playlistDao.findById(playlistId);
            Optional<Video> optionalVideo = videoDao.findById(videoId);

            if (optionalPlaylist.isPresent() && optionalVideo.isPresent()) {
                PlayList playlist = optionalPlaylist.get();
                Video video = optionalVideo.get();

                // Verificar si el video está en la lista de reproducción
                List<Video> videos = playlist.getVideos();
                if (!videos.contains(video)) {
                    response.setMetadata("Respuesta NOK", "-1", "El video no está en la lista de reproducción");
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }

                // Eliminar el video de la lista de reproducción
                videos.remove(video);
                playlist.setVideos(videos);
                playlist.setLastModifiedTimestamp(new Timestamp(System.currentTimeMillis()));
                PlayList savedPlaylist = playlistDao.save(playlist);

                if (savedPlaylist != null) {
                    List<PlayList> list = new ArrayList<>();
                    list.add(savedPlaylist);
                    response.getPlayListResponse().setPlaylist(list);
                    response.setMetadata("Respuesta OK", "00", "Video eliminado correctamente de la lista de reproducción");
                } else {
                    response.setMetadata("Respuesta NOK", "-1", "Error al guardar la lista de reproducción");
                    return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                response.setMetadata("Respuesta NOK", "-1", "No se encontró la lista de reproducción o el video");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al eliminar el video de la lista de reproducción");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
    @Transactional
    public ResponseEntity<PlayListResponseRest> deletePlaylist(Long playlistId) {
        PlayListResponseRest response = new PlayListResponseRest();
        try {
            Optional<PlayList> optionalPlaylist = playlistDao.findById(playlistId);

            if (optionalPlaylist.isPresent()) {
                PlayList playlist = optionalPlaylist.get();
                // Inicializar explícitamente la colección de videos
                Hibernate.initialize(playlist.getVideos());
                
                playlistDao.delete(playlist);

                List<PlayList> list = new ArrayList<>();
                list.add(playlist);
                response.getPlayListResponse().setPlaylist(list);
                response.setMetadata("Respuesta OK", "00", "Lista de reproducción eliminada correctamente");
            } else {
                response.setMetadata("Respuesta NOK", "-1", "No se encontró la lista de reproducción con el ID proporcionado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al eliminar la lista de reproducción");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	@Override
    @Transactional(readOnly = true)
    public ResponseEntity<PlayListResponseRest> listVideosByPlaylistId(Long playlistId) {
        PlayListResponseRest response = new PlayListResponseRest();
        try {
            Optional<PlayList> optionalPlaylist = playlistDao.findById(playlistId);

            if (optionalPlaylist.isPresent()) {
                PlayList playlist = optionalPlaylist.get();
                // Inicializar explícitamente la colección de videos
                Hibernate.initialize(playlist.getVideos());

                List<Video> videos = playlist.getVideos();
                response.getPlayListResponse().setPlaylist(Collections.singletonList(playlist));
                response.setMetadata("Respuesta OK", "00", "Lista de videos obtenida correctamente");
            } else {
                response.setMetadata("Respuesta NOK", "-1", "No se encontró la lista de reproducción con el ID proporcionado");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al obtener la lista de videos");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

	
	public void deletePlayListsByUserId(Long userId) {
        List<PlayList> playlists = playlistDao.findByUser_Id(userId);
        playlistDao.deleteAll(playlists);
    }
	
	public void removeVideoFromPlayLists(Long videoId) {
        List<PlayList> playlists = playlistDao.findByVideos_Id(videoId);
        for (PlayList playlist : playlists) {
            playlist.getVideos().removeIf(video -> video.getId().equals(videoId));
            playlistDao.save(playlist);
        }
    }
}
