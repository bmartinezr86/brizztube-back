package com.brizztube.response;

import java.util.List;

import com.brizztube.model.Video;

import lombok.Data;

@Data
public class VideoResponse {
	private List<Video> video;
}
