package com.brizztube.services.impl;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import com.brizztube.dao.ICategoryDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.dao.IVideoDao;
import com.brizztube.model.Category;
import com.brizztube.model.User;
import com.brizztube.model.Video;
import com.brizztube.response.UserResponseRest;
import com.brizztube.response.VideoResponseRest;
import com.brizztube.services.IVideoService;
import com.brizztube.utils.Util;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VideoServiceImpl implements IVideoService {

	@Autowired
	private ICategoryDao categoryDao;

	@Autowired
	private IUserDao userDao;

	@Autowired
	private IVideoDao videoDao;

	@Value("${upload.video.path}")
    private String videoUploadPath; // obtenemos la ruta del properties

    @Value("${upload.thumbnail.path}")
    private String thumbnailUploadPath; // obtenemos la ruta del properties

	private Path rootLocation;

	@Transactional
	@Override
	public ResponseEntity<VideoResponseRest> save(Video video, MultipartFile videoFile, MultipartFile thumbnailFile,
			Long categoryId, Long userId) {
		VideoResponseRest response = new VideoResponseRest();
        List<Video> list = new ArrayList<>();

        try {
            Optional<User> user = userDao.findById(userId);
            if (user.isPresent()) {
                video.setUser(user.get());
            } else {
                response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            Optional<Category> category = categoryDao.findById(categoryId);
            if (category.isPresent()) {
                video.setCategory(category.get());
            } else {
                response.setMetadata("Respuesta NOK", "-1", "La categoria no existe");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            String videoFileName = saveFile(videoFile, videoUploadPath);
            String thumbnailFileName = saveFile(thumbnailFile, thumbnailUploadPath);

            video.setVideoLocation(constructFileUrl(videoFileName, "/files/videos/"));
            video.setThumbnailLocation(constructFileUrl(thumbnailFileName, "/files/thumbnails/"));

            Video videoSaved = videoDao.save(video);

            if (videoSaved != null) {
                list.add(videoSaved);
                response.getVideoResponse().setVideo(list);
                response.setMetadata("Respuesta OK", "00", "Video subido con exito");
            } else {
                response.setMetadata("Respuesta NOK", "-1", "El video no se ha podido subir debido a un error");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al guardar el video");
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
	}
	 @Override
	    @Transactional(readOnly = true)
	    public ResponseEntity<VideoResponseRest> search() {
	        VideoResponseRest response = new VideoResponseRest();
	        List<Video> list = new ArrayList<>();
	        List<Video> listAux = new ArrayList<>();

	        try {
	            listAux = (List<Video>) videoDao.findAll();
	            if (listAux.size() > 0) {
	                listAux.forEach((u) -> {
	                    Hibernate.initialize(u.getCategory());
	                    Hibernate.initialize(u.getUser());
	                    u.setVideoLocation(constructFileUrl(u.getVideoLocation(), "/files/videos/"));
	                    u.setThumbnailLocation(constructFileUrl(u.getThumbnailLocation(), "/files/thumbnails/"));
	                    list.add(u);
	                });
	            }
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Respuesta exitosa");

	        } catch (Exception e) {
	            response.setMetadata("Respuesta NOK", "-1", "Error al consultar");
	            e.printStackTrace();
	            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	        }

	        return new ResponseEntity<>(response, HttpStatus.OK);
	    }

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<VideoResponseRest> searchByTitle(String title) {
	    VideoResponseRest response = new VideoResponseRest();
	    List<Video> list = new ArrayList<>();
	    
	    try {
	        // Buscar videos por título (ignorando mayúsculas y minúsculas)
	        List<Video> listAux = videoDao.findByTitleContainingIgnoreCase(title);

	        if (!listAux.isEmpty()) {
	            for (Video video : listAux) {
	                // Inicializar relaciones cargadas de forma perezosa
	                Hibernate.initialize(video.getCategory());
	                Hibernate.initialize(video.getUser());

	             // Construir las URLs completas para el video y la miniatura
	                String videoUrl = constructFileUrl(video.getVideoLocation(), "/files/");
	                String thumbnailUrl = constructFileUrl(video.getThumbnailLocation(), "/files/");
	                video.setVideoLocation(videoUrl);
	                video.setThumbnailLocation(thumbnailUrl);

	                list.add(video);
	            }
	            
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Videos encontrados");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "Video no encontrado");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por nombre");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<VideoResponseRest> searchByCategoryId(Long categoryId) {
	    VideoResponseRest response = new VideoResponseRest();
	    List<Video> list = new ArrayList<>();
	    
	    try {
	        // Buscar videos por ID de categoría
	        List<Video> listAux = videoDao.findByCategoryId(categoryId);

	        if (!listAux.isEmpty()) {
	            for (Video video : listAux) {
	                // Inicializar relaciones cargadas de forma perezosa
	                Hibernate.initialize(video.getCategory());
	                Hibernate.initialize(video.getUser());

	                // Construir las URLs completas para el video y la miniatura
	                String videoUrl = constructFileUrl(video.getVideoLocation(), "/files/");
	                String thumbnailUrl = constructFileUrl(video.getThumbnailLocation(), "/files/");
	                video.setVideoLocation(videoUrl);
	                video.setThumbnailLocation(thumbnailUrl);

	                list.add(video);
	            }
	            
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Videos encontrados");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "Videos no encontrados en esta categoría");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por categoría");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Transactional
	@Override
	public ResponseEntity<VideoResponseRest> delete(Long id) {
		VideoResponseRest response = new VideoResponseRest();
		try {
			Optional<Video> optionalVideo = videoDao.findById(id);
			if (optionalVideo.isPresent()) {
				Video video = optionalVideo.get();

				// Eliminar los archivos de vídeo y miniatura del sistema de archivos
				deleteFile(video.getVideoLocation());
				deleteFile(video.getThumbnailLocation());

				// Eliminar el video de la base de datos
				videoDao.delete(video);

				response.setMetadata("Respuesta OK", "00", "Video eliminado correctamente");
				return new ResponseEntity<>(response, HttpStatus.OK);
			} else {
				response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
				return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al eliminar el video");
			e.printStackTrace();
			return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	@Override
	public ResponseEntity<VideoResponseRest> update(MultipartFile videoFile, MultipartFile thumbnailFile, String title,
	        String description, Long categoryId, Long userId, Long videoId) throws IOException {
	    VideoResponseRest response = new VideoResponseRest();
	    List<Video> list = new ArrayList<>();

	    try {
	        // Buscar el video a actualizar por su ID
	        Optional<Video> optionalVideo = videoDao.findById(videoId);
	        if (optionalVideo.isPresent()) {
	            Video existingVideo = optionalVideo.get();

	            // No se permite cambiar el archivo de video
	            if (videoFile != null && !videoFile.isEmpty()) {
	                response.setMetadata("Respuesta NOK", "-1", "No se permite cambiar el archivo de video");
	                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	            }

	            // Si se proporciona una nueva miniatura, guardarla
	            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
	                String thumbnailFileName = saveFile(thumbnailFile, "/ruta/de/carga/thumbnails/");
	                existingVideo.setThumbnailLocation(thumbnailFileName);
	            }

	            // Actualizar los otros campos del video
	            existingVideo.setTitle(title);
	            existingVideo.setDescription(description);

	            // Buscar la categoría por su ID y asignarla al video
	            Optional<Category> optionalCategory = categoryDao.findById(categoryId);
	            if (optionalCategory.isPresent()) {
	                existingVideo.setCategory(optionalCategory.get());
	            } else {
	                response.setMetadata("Respuesta NOK", "-1", "La categoría no existe");
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            }

	            // Buscar el usuario por su ID y asignarlo al video
	            Optional<User> optionalUser = userDao.findById(userId);
	            if (optionalUser.isPresent()) {
	                existingVideo.setUser(optionalUser.get());
	            } else {
	                response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
	                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	            }

	            // Guardar los cambios en la base de datos
	            Video updatedVideo = videoDao.save(existingVideo);

	            // Construir las URLs completas para el video y la miniatura
	            String videoUrl = constructFileUrl(updatedVideo.getVideoLocation(), "/files/");
	            String thumbnailUrl = constructFileUrl(updatedVideo.getThumbnailLocation(), "/files/");
	            updatedVideo.setVideoLocation(videoUrl);
	            updatedVideo.setThumbnailLocation(thumbnailUrl);

	            list.add(updatedVideo);
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Video actualizado correctamente");
	            return new ResponseEntity<>(response, HttpStatus.OK);
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al actualizar el video");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	
	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<VideoResponseRest> searchByUserId(Long userId) {
	    VideoResponseRest response = new VideoResponseRest();
	    List<Video> list = new ArrayList<>();
	    List<Video> listAux = new ArrayList<>();

	    try {
	        // Buscar videos por ID de usuario
	        listAux = videoDao.findByUserId(userId);

	        // Descomprime picture in all users
	        if (listAux.size() > 0) {
	            listAux.forEach((u) -> {
	                // Initialize lazy-loaded relationships
	                Hibernate.initialize(u.getCategory());
	                Hibernate.initialize(u.getUser());

	                // Construct the full URL for the video and thumbnail
	                String videoUrl = constructFileUrl(u.getVideoLocation(), "/files/");
	                String thumbnailUrl = constructFileUrl(u.getThumbnailLocation(), "/files/");
	                u.setVideoLocation(videoUrl);
	                u.setThumbnailLocation(thumbnailUrl);

	                list.add(u);
	            });

	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Videos encontrados");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "Video no encontrado");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }

	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por nombre");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	
	
	public Resource loadAsResource(String filename) {
		try {
			Path file = rootLocation.resolve(filename);
			Resource resource = new UrlResource(file.toUri());
			
			if(resource.exists()|| resource.isReadable()) {
				return resource;
			} else {
				throw new RuntimeException("Could not read file: "+filename);
			}
		} catch (MalformedURLException e) {
			throw new RuntimeException("Could not read file: "+filename);
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
	public String saveFile(MultipartFile file, String uploadPath) throws IOException {
		if (file.isEmpty()) {
            throw new RuntimeException("Error al guardar archivo vacío.");
        }

        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path destinationFile = Paths.get(uploadPath, uniqueFileName).normalize().toAbsolutePath();

        if (!destinationFile.getParent().equals(Paths.get(uploadPath).toAbsolutePath())) {
            throw new RuntimeException("No se puede almacenar el archivo fuera del directorio actual.");
        }

        try {
            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (FileAlreadyExistsException e) {
            throw new FileAlreadyExistsException("El archivo " + file.getOriginalFilename() + " ya existe.");
        }

        return uniqueFileName;
	}

	@Override
	public String constructFileUrl(String fileName, String basePath) {
	    return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(basePath)
                .path(fileName)
                .toUriString();
	}

	

}
