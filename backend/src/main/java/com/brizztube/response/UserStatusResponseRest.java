package com.brizztube.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserStatusResponseRest extends ResponseRest{
	private UserStatusResponse userStatus= new UserStatusResponse();
}

