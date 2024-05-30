package com.brizztube.response;

import java.util.List;

import com.brizztube.model.PlayList;

import lombok.Data;

@Data
public class PlayListResponse {
	private List<PlayList> playlist;
}
