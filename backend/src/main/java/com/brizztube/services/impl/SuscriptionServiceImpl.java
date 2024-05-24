package com.brizztube.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brizztube.dao.ISuscriptionDao;
import com.brizztube.dao.IUserDao;
import com.brizztube.model.Suscription;
import com.brizztube.model.User;
import com.brizztube.response.SuscriptionResponseRest;
import com.brizztube.services.ISuscriptionService;

@Service
public class SuscriptionServiceImpl implements ISuscriptionService {

	@Autowired // instancia el objeto
	private IUserDao userDao;

	@Autowired // instancia el objeto
	private ISuscriptionDao suscriptionDao;

	@Transactional
	@Override
	public ResponseEntity<SuscriptionResponseRest> subscribe(Long subscriberId, Long subscribedTo) {
		SuscriptionResponseRest response = new SuscriptionResponseRest();
		List<Suscription> list = new ArrayList<>();

		try {

			// Validamos que un usuario no se intente suscribir a si mismo
			if (subscriberId == subscribedTo) {
				response.setMetadata("Respuesta NOK", "-1", "No puedes suscribirte a tu propio canal");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.BAD_REQUEST);
			}

			Optional<User> userSuscriber = userDao.findById(subscriberId);

			// Validamos si el usuario que se quiere suscribir existe
			if (!userSuscriber.isPresent()) {
				response.setMetadata("Respuesta NOK", "-1", "No existe el usuario que desea suscribirse");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Validamos que el usuario al que se quiere suscribir existe
			Optional<User> userSuscribedTo = userDao.findById(subscribedTo);

			if (!userSuscribedTo.isPresent()) {
				response.setMetadata("Respuesta NOK", "-1", "No existe el usuario al que desea suscribirse");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Check if subscriber is already subscribed to the same user
			if (suscriptionDao.existsBySubscriberAndSubscribedTo(userSuscriber.get(), userSuscribedTo.get())) {
				response.setMetadata("Respuesta NOK", "-1", "Ya estás suscrito al usuario");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.BAD_REQUEST);
			}

			// Se suscribe
			Suscription suscription = new Suscription();
			suscription.setSubscriber(userSuscriber.get());
			suscription.setSubscribedTo(userSuscribedTo.get());
			Suscription savedSuscription = suscriptionDao.save(suscription);

			if (savedSuscription != null) {
				list.add(savedSuscription);
				response.getSuscriptionResponse().setSuscription(list);
				response.setMetadata("Respuesta OK", "00", "Usuario suscrito con éxito");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "Error al suscribirse");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.BAD_REQUEST);
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al suscribirse");
			e.getStackTrace();
			return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.OK);
	}

	@Override
	@Transactional
	public ResponseEntity<SuscriptionResponseRest> unsubscribe(Long subscriberId, Long subscribedToId) {
		SuscriptionResponseRest response = new SuscriptionResponseRest();

		try {
			Optional<User> userSuscriber = userDao.findById(subscriberId);

			// Validamos si el usuario que se quiere desuscribir existe
			if (!userSuscriber.isPresent()) {
				response.setMetadata("Respuesta NOK", "-1", "No existe el usuario que desea suscribirse");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Validamos que el usuario al que se quiere desuscribir existe
			Optional<User> userSuscribedTo = userDao.findById(subscribedToId);

			if (!userSuscribedTo.isPresent()) {
				response.setMetadata("Respuesta NOK", "-1", "No existe el usuario al que desea suscribirse");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Validamos si existia la suscripcion
			Optional<Suscription> subscriptionOptional = suscriptionDao
					.findBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
			if (subscriptionOptional.isPresent()) {
				Suscription subscription = subscriptionOptional.get();
				Long subscriptionId = subscription.getId();
				suscriptionDao.deleteById(subscriptionId);
				response.setMetadata("Respuesta OK", "00", "Usuario desuscrito con éxito");
			} else {
				response.setMetadata("Respuesta NOK", "-1", "No existe la suscripcion");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.NOT_FOUND);
			}

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al suscribirse");
			e.getStackTrace();
			return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.OK);
	}

	@Transactional(readOnly = true)
	@Override
	public ResponseEntity<SuscriptionResponseRest> getSuscriptionCountByUserId(Long userId) {
		SuscriptionResponseRest response = new SuscriptionResponseRest();

		try {
			// Validar si el usuario existe
			Optional<User> user = userDao.findById(userId);
			if (!user.isPresent()) {
				response.setMetadata("Respuesta NOK", "-1", "No existe el usuario");
				return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.NOT_FOUND);
			}

			// Contar suscriptores
			long subscriberCount = suscriptionDao.countBySubscribedToId(user.get().getId());
			response.setMetadata("Respuesta OK", "00", "Número de suscriptores obtenido con éxito");
			response.getSuscriptionResponse().setSubscriberCount(subscriberCount); // Añadir campo subscriberCount a
																					// SuscriptionResponse

		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al obtener el número de suscriptores");
			return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.OK);
	}

	@Transactional
	@Override
	public ResponseEntity<SuscriptionResponseRest> deleteSubscriptionsByUserId(Long userId) {
		SuscriptionResponseRest response = new SuscriptionResponseRest();
		try {
			// Buscar las suscripciones por el ID del usuario y eliminarlas
			List<Suscription> subscriptions = suscriptionDao.findBySubscribedToId(userId);
			suscriptionDao.deleteAll(subscriptions);

			response.setMetadata("Respuesta OK", "00", "Suscripciones eliminadas correctamente");
			return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.OK);
		} catch (Exception e) {
			response.setMetadata("Respuesta NOK", "-1", "Error al eliminar las suscripciones");
			e.printStackTrace();
			return new ResponseEntity<SuscriptionResponseRest>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
