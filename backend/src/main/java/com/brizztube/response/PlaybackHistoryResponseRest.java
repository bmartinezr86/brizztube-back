package com.brizztube.response;

import java.util.List;

import com.brizztube.model.PlayList;
import com.brizztube.model.PlaybackHistory;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaybackHistoryResponseRest extends ResponseRest{
	private PlaybackHistoryResponse playbackHistoryResponse= new PlaybackHistoryResponse();
}
	