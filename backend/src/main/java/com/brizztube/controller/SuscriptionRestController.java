package com.brizztube.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

@CrossOrigin(origins = { "http://localhost:4200" }) // angular
@RestController
@RequestMapping("/api/suscriptions")
public class SuscriptionRestController {
	 @Autowired
	    private ISuscriptionService subscriptionService;

	    @PostMapping("/subscribe")
	    public ResponseEntity<SuscriptionResponseRest> subscribe(@RequestParam("subscriberId") Long subscriberId,
	                                                             @RequestParam("subscribedTo") Long subscribedTo) {
	        return subscriptionService.subscribe(subscriberId, subscribedTo);
	    }
	    
	    @DeleteMapping("/unsuscribe/{subscriberId}/{subscribedTo}")
	    public ResponseEntity<SuscriptionResponseRest> unsubscribe(@PathVariable("subscriberId") Long subscriberId,
                @PathVariable("subscribedTo") Long subscribedTo) {
	        return subscriptionService.unsubscribe(subscriberId, subscribedTo);
	    }
	    
	    @GetMapping("/countSubscribers/{userId}")
	    public ResponseEntity<SuscriptionResponseRest> countSubscribers(@PathVariable("userId") Long userId) {
	        return subscriptionService.getSuscriptionCountByUserId(userId);
	    }
	    
	    
}
