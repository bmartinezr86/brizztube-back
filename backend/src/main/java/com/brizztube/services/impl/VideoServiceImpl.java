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

	@Value("${video.upload-dir}")
	private String uploadDir;

	private final Path rootLocation = Paths.get("upload-videos");

	@Override
	public ResponseEntity<VideoResponseRest> save(Video video, MultipartFile videoFile, MultipartFile thumnailFile,
			Long categoryId, Long userId) {
		VideoResponseRest response = new VideoResponseRest();
		List<Video> list = new ArrayList<>();

		try {

			// search user to set userID
			Optional<User> user = userDao.findById(userId); // Es opcional por si no existiera poder validar con los
															// metodos
			if (user.isPresent()) {
				video.setUser(user.get());
			} else {
				response.setMetadata("Respuesta NOK", "-1", "El usuario no existe");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// search category to set categoryID
			Optional<Category> category = categoryDao.findById(categoryId); // Es opcional por si no existiera poder
																			// validar con los
			// metodos

			if (category.isPresent()) {
				video.setCategory(category.get());
			} else {
				response.setMetadata("Respuesta NOK", "-1", "La categoria no existe");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Save files
			String videoFileName = saveFile(videoFile);
			String thumbnailFileName = saveFile(thumnailFile);

			// Set file paths
			video.setVideoLocation(videoFileName);
			video.setThumbnailLocation(thumbnailFileName);

			// save video
			Video videoSaved = videoDao.save(video);

			if (videoSaved != null) {
				list.add(videoSaved);
				response.getVideoResponse().setVideo(list);
				response.setMetadata("Respuesta OK", "00", "Video subido con exito");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "El video no se ha podido subir debido a un error");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al guardar el video");
			e.getStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional(readOnly = true)
	public ResponseEntity<VideoResponseRest> search() {
		VideoResponseRest response = new VideoResponseRest();
		List<Video> list = new ArrayList<>();
		List<Video> listAux = new ArrayList<>();

		try {

			// search videos
			listAux = (List<Video>) videoDao.findAll();
			if (listAux.size() > 0) {
				listAux.forEach((u) -> {
					try {
						// Initialize lazy-loaded relationships
						Hibernate.initialize(u.getCategory());
						Hibernate.initialize(u.getUser());

						// Construct the full URL for the video and thumbnail
						String videoUrl = constructFileUrl(u.getVideoLocation());
						String thumbnailUrl = constructFileUrl(u.getThumbnailLocation());
						u.setVideoLocation(videoUrl);
						u.setThumbnailLocation(thumbnailUrl);

						list.add(u);
					} catch (Exception e) {
						response.setMetadata("Respuesta NOK", "-1", "Error el contenido no esta disponible");
						e.printStackTrace();

					}
				});
			}
			response.getVideoResponse().setVideo(list);
			response.setMetadata("Respuesta OK", "00", "Respuesta exitosa");

		} catch (Exception e) {
			// Manejar cualquier excepción general
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
		List<Video> listAux = new ArrayList<>();

		try {
			// search user by name
			listAux = videoDao.findByTitleContainingIgnoreCase(title);

			// Descomprime picture in all users
			if (listAux.size() > 0) {
				listAux.stream().forEach((u) -> {
					// Initialize lazy-loaded relationships
					Hibernate.initialize(u.getCategory());
					Hibernate.initialize(u.getUser());

					// Construct the full URL for the video and thumbnail
					String videoUrl = constructFileUrl(u.getVideoLocation());
					String thumbnailUrl = constructFileUrl(u.getThumbnailLocation());
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
			e.getStackTrace();
			return new ResponseEntity<VideoResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<VideoResponseRest>(response, HttpStatus.OK);
	}

	@Transactional(readOnly = true)
	@Override
	public ResponseEntity<VideoResponseRest> searchByCategoryId(Long categoryId) {
		VideoResponseRest response = new VideoResponseRest();
		List<Video> list = new ArrayList<>();
		List<Video> listAux = new ArrayList<>();

		try {
			// search user by name
			listAux = videoDao.findByCategoryId(categoryId);

			// Descomprime picture in all users
			if (listAux.size() > 0) {
				listAux.stream().forEach((u) -> {
					// Initialize lazy-loaded relationships
					Hibernate.initialize(u.getCategory());
					Hibernate.initialize(u.getUser());

					// Construct the full URL for the video and thumbnail
					String videoUrl = constructFileUrl(u.getVideoLocation());
					String thumbnailUrl = constructFileUrl(u.getThumbnailLocation());
					u.setVideoLocation(videoUrl);
					u.setThumbnailLocation(thumbnailUrl);

					list.add(u);
				});

				response.getVideoResponse().setVideo(list);
				response.setMetadata("Respuesta OK", "00", "Videos encontrados");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Video no encontrados en esta categoria");
				return new ResponseEntity<VideoResponseRest>(response, HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al buscar el video por categoria");
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
					String thumbnailFileName = saveFile(thumbnailFile);
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

	private String saveFile(MultipartFile file) throws IOException {
		if (file.isEmpty()) {
			throw new RuntimeException("Failed to store empty file.");
		}

		// Generate a unique identifier for the file
		String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

		Path destinationFile = this.rootLocation.resolve(Paths.get(uniqueFileName)).normalize().toAbsolutePath();

		if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
			// This is a security check
			throw new RuntimeException("Cannot store file outside current directory.");
		}

		try {
			Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);
		} catch (FileAlreadyExistsException e) {
			throw new FileAlreadyExistsException("El archivo " + file.getOriginalFilename() + " ya existe.");
		}

		return destinationFile.toString();
	}

	private String constructFileUrl(String fileName) {
		return ServletUriComponentsBuilder.fromCurrentContextPath().path("/files/").path(fileName).toUriString();
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

}
