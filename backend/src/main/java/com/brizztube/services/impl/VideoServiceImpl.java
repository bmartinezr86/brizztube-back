package com.brizztube.services.impl;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import java.io.File;
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
	
	@Autowired
	private LikeServiceImpl likeService;
	
	@Autowired
	private ViewServiceImpl viewService;
	
	
	
	@Value("${upload.video.path}")
	private String videoUploadPath; // obtenemos la ruta del properties

	@Value("${upload.thumbnail.path}")
	private String thumbnailUploadPath; // obtenemos la ruta del properties

	private Path rootLocation;

	
	@Transactional
	@Override
	public ResponseEntity<VideoResponseRest> uploadVideo(MultipartFile videoFile, Long userId) {
	    VideoResponseRest response = new VideoResponseRest();
	    List<Video> list = new ArrayList<>();

	    try {
	        // Crear instancia de Video
	        Video video = new Video();
	        
	        // Configurar el ID del usuario
	        Optional<User> userOpt = userDao.findById(userId);
	        if (!userOpt.isPresent()) {
	            response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	        User user = userOpt.get();
	        video.setUser(user);

	        // Configurar la categoría por su ID
	        Long categoryId = 11L; // ID de la categoría
	        Optional<Category> categoryOpt = categoryDao.findById(categoryId);
	        if (!categoryOpt.isPresent()) {
	            response.setMetadata("Respuesta NOK", "-1", "La categoría no existe");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	        Category category = categoryOpt.get();
	        video.setCategory(category);

	        // Guardar archivo de video
	        String videoUri = saveFile(videoFile, videoUploadPath);
	        video.setVideoLocation(videoUri);

	        // Guardar el objeto Video sin detalles adicionales
	        Video videoSaved = videoDao.save(video);

	        if (videoSaved != null) {
	            list.add(videoSaved);
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Video subido con éxito");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "El video no se ha podido subir debido a un error");
	            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al subir el video");
	        e.printStackTrace();
	        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@Transactional
	@Override
	public ResponseEntity<VideoResponseRest> saveDetails(Long videoId, String title, String description, MultipartFile thumbnailFile, Long categoryId) {
	    VideoResponseRest response = new VideoResponseRest();
	    List<Video> list = new ArrayList<>();

	    try {
	        // Obtener el video por su ID
	        Optional<Video> videoOpt = videoDao.findById(videoId);
	        if (!videoOpt.isPresent()) {
	            response.setMetadata("Respuesta NOK", "-1", "El video no existe");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	        Video video = videoOpt.get();

	        // Actualizar los detalles del video
	        video.setTitle(title);
	        video.setDescription(description);

	        // Configurar la categoría del video
	        Optional<Category> categoryOpt = categoryDao.findById(categoryId);
	        if (!categoryOpt.isPresent()) {
	            response.setMetadata("Respuesta NOK", "-1", "La categoría no existe");
	            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	        }
	        Category category = categoryOpt.get();
	        video.setCategory(category);

	     // Guardar el archivo de miniatura solo si se proporcionó uno nuevo
	        if (thumbnailFile != null) {
	            String thumbnailUri = saveFile(thumbnailFile, thumbnailUploadPath);
	            video.setThumbnailLocation(thumbnailUri);
	        }

	        // Guardar los cambios en el video
	        Video videoSaved = videoDao.save(video);

	        if (videoSaved != null) {
	            list.add(videoSaved);
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Detalles del video guardados con éxito");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "No se pudieron guardar los detalles del video debido a un error");
	            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al guardar los detalles del video");
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
			if (!listAux.isEmpty()) {
				listAux.forEach(u -> {
					Hibernate.initialize(u.getCategory());
					Hibernate.initialize(u.getUser());

					// Obtener las URL de los archivos (videos y miniaturas) utilizando getFileUrl
					u.setVideoLocation(getFileUrl(u.getId(), videoUploadPath));
					u.setThumbnailLocation(getFileUrl(u.getId(), thumbnailUploadPath));

					list.add(u);
				});
			}
			response.getVideoResponse().setVideo(list);
			response.setMetadata("Respuesta OK", "00", "Respuesta exitosa");

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar");
			e.printStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
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
				listAux.forEach(u -> {
					Hibernate.initialize(u.getCategory());
					Hibernate.initialize(u.getUser());

					// Obtener las URL de los archivos (videos y miniaturas) utilizando getFileUrl
					u.setVideoLocation(getFileUrl(u.getId(), videoUploadPath));
					u.setThumbnailLocation(getFileUrl(u.getId(), thumbnailUploadPath));

					list.add(u);
				});

				response.getVideoResponse().setVideo(list);
				response.setMetadata("Respuesta OK", "00", "Videos encontrados");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Video no encontrado");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por nombre");
			e.printStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
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
				listAux.forEach(u -> {
					Hibernate.initialize(u.getCategory());
					Hibernate.initialize(u.getUser());

					// Obtener las URL de los archivos (videos y miniaturas) utilizando getFileUrl
					u.setVideoLocation(getFileUrl(u.getId(), videoUploadPath));
					u.setThumbnailLocation(getFileUrl(u.getId(), thumbnailUploadPath));

					list.add(u);
				});

				response.getVideoResponse().setVideo(list);
				response.setMetadata("Respuesta OK", "00", "Videos encontrados");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Videos no encontrados en esta categoría");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por categoría");
			e.printStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
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

	                // Obtener las URLs de los archivos (video y miniatura) utilizando getFileUrl
	                String videoUrl = getFileUrl(u.getId(), videoUploadPath);
	                String thumbnailUrl = getFileUrl(u.getId(), thumbnailUploadPath);
	                u.setVideoLocation(videoUrl);
	                u.setThumbnailLocation(thumbnailUrl);

	                list.add(u);
	            });

	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Videos encontrados");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "Video no encontrado");
	            return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
	        }

	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por nombre");
	        e.printStackTrace();
	        return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	    }

	    return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
	}
	
	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<VideoResponseRest> searchById(Long videoId) {
		VideoResponseRest response = new VideoResponseRest();
		List<Video> list = new ArrayList<>();

		try {

			Optional<Video> video = videoDao.findById(videoId); // Es opcional por si no existiera poder validar con los metodos
														// que trae

			// Si el video existe
			if (video.isPresent()) {
				list.add(video.get());
				response.getVideoResponse().setVideo(list);
				response.setMetadata("Respuesta OK", "00", "Video encontrado");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Video no encontrado");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al consultar por id");
			e.getStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
	}

	@Transactional
	@Override
	public ResponseEntity<VideoResponseRest> delete(Long id) {
		VideoResponseRest response = new VideoResponseRest();
		try {
			Optional<Video> optionalVideo = videoDao.findById(id);
			if (optionalVideo.isPresent()) {
				Video video = optionalVideo.get();

				likeService.deleteLikesByVideoId(id);
				viewService.deleteViewsByVideoId(id);
				// Eliminar los archivos de vídeo y miniatura del sistema de archivos
				deleteFile(video.getVideoLocation());
				deleteFile(video.getThumbnailLocation());

				// Eliminar el video de la base de datos
				videoDao.delete(video);

				response.setMetadata("Respuesta OK", "00", "Video eliminado correctamente");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
			} else {
				response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al eliminar el video");
			e.printStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Transactional
    @Override
    public ResponseEntity<VideoResponseRest> deleteVideosByUserId(Long userId) {
        VideoResponseRest response = new VideoResponseRest();
        try {
            // Buscar los videos por el ID del usuario y eliminarlos
            List<Video> videos = videoDao.findByUserId(userId);
            for (Video video : videos) {
            	likeService.deleteLikesByVideoId(video.getId());
				viewService.deleteViewsByVideoId(video.getId());
                deleteFile(video.getVideoLocation());
                deleteFile(video.getThumbnailLocation());
                videoDao.delete(video);
            }

            response.setMetadata("Respuesta OK", "00", "Videos eliminados correctamente");
            return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMetadata("Respuesta NOK", "-1", "Error al eliminar los videos");
            e.printStackTrace();
            return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
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
	                return new ResponseEntity<VideoResponseRest>(response, HttpStatus.BAD_REQUEST);
	            }

	            // Si se proporciona una nueva miniatura, guardarla
	            if (thumbnailFile != null && !thumbnailFile.isEmpty()) {
	                String thumbnailFileName = saveFile(thumbnailFile, thumbnailUploadPath);
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
	                return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
	            }

	            // Buscar el usuario por su ID y asignarlo al video
	            Optional<User> optionalUser = userDao.findById(userId);
	            if (optionalUser.isPresent()) {
	                existingVideo.setUser(optionalUser.get());
	            } else {
	                response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
	                return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
	            }

	            // Guardar los cambios en la base de datos
	            Video updatedVideo = videoDao.save(existingVideo);

	            // Obtener las URLs de los archivos (video y miniatura) utilizando getFileUrl
	            String videoUrl = getFileUrl(updatedVideo.getId(), videoUploadPath);
	            String thumbnailUrl = getFileUrl(updatedVideo.getId(), thumbnailUploadPath);
	            updatedVideo.setVideoLocation(videoUrl);
	            updatedVideo.setThumbnailLocation(thumbnailUrl);

	            list.add(updatedVideo);
	            response.getVideoResponse().setVideo(list);
	            response.setMetadata("Respuesta OK", "00", "Video actualizado correctamente");
	            return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "No se encontró ningún video con el ID proporcionado");
	            return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
	        }
	    } catch (Exception e) {
	        response.setMetadata("Respuesta NOK", "-1", "Error al actualizar el video");
	        e.printStackTrace();
	        return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
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
	public String saveFile(MultipartFile file, String uploadDir) throws IOException {
		String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
		byte[] bytes = file.getBytes();
		Path path = Paths.get(uploadDir).resolve(uniqueFileName);
		Files.createDirectories(path.getParent()); // Asegurarse de que el directorio existe
		Files.write(path, bytes);

		String fileUri = uploadDir + "/" + uniqueFileName; // URL relativa

		return fileUri;
	}

	@Override
	public String getFileUrl(Long videoId, String uploadDir) {
		Video video = videoDao.findById(videoId).orElse(null);
		if (video == null) {
			return null;
		}

		String fileLocation;
		if (uploadDir.equals(videoUploadPath)) {
			fileLocation = video.getVideoLocation();
		} else if (uploadDir.equals(thumbnailUploadPath)) {
			fileLocation = video.getThumbnailLocation();
		} else {
			return null;
		}

		try {
			Path path = Paths.get(fileLocation);
			return path.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
