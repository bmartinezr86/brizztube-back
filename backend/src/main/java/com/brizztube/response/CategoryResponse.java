package com.brizztube.response;

import java.util.List;

import com.brizztube.model.Category;

import lombok.Data;

@Data
public class CategoryResponse {
	private List<Category> category;
}
