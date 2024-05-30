package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brizztube.response.SuscriptionResponseRest;
import com.brizztube.services.ISuscriptionService;

@CrossOrigin(origins = {"http://localhost:4200"}) // angular
@RestController
@RequestMapping("/api/suscriptions")
public class SuscriptionRestController {
	 @Autowired
	    private ISuscriptionService service;
	 @PostMapping("/subscribe")
	 public ResponseEntity<SuscriptionResponseRest> subscribe(@RequestParam("subscriberId") Long subscriberId,
	                                                          @RequestParam("subscribedTo") Long subscribedTo) {
	     return service.subscribe(subscriberId, subscribedTo);
	 }

	 @DeleteMapping("/unsubscribe/{subscriberId}/{subscribedTo}")
	 public ResponseEntity<SuscriptionResponseRest> unsubscribe(@PathVariable("subscriberId") Long subscriberId,
	                                                             @PathVariable("subscribedTo") Long subscribedTo) {
	     return service.unsubscribe(subscriberId, subscribedTo);
	 }
	   
	    
	    @GetMapping("/check/{subscriberId}/{subscribedToId}")
	    public ResponseEntity<SuscriptionResponseRest> checkSubscription(
	            @PathVariable Long subscriberId, @PathVariable Long subscribedToId) {
	        boolean isSubscribed = service.checkSubscription(subscriberId, subscribedToId);
	        SuscriptionResponseRest response = new SuscriptionResponseRest();
	        if (isSubscribed) {
	            response.setMetadata("Respuesta OK", "00", "El usuario está suscrito");
	        } else {
	            response.setMetadata("Respuesta NOK", "-1", "El usuario no está suscrito");
	        }
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    }
	    
	    
}
