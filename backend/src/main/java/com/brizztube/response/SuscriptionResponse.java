package com.brizztube.response;

import java.util.List;

import com.brizztube.model.Suscription;
import com.brizztube.model.User;

import lombok.Data;
@Data
public class SuscriptionResponse {
	private List<Suscription> suscription;
	private long subscriberCount;
}
