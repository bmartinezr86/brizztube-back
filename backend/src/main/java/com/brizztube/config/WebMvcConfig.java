package com.brizztube.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${upload.video.path}")
    private String videoUploadPath;

    @Value("${upload.thumbnail.path}")
    private String thumbnailUploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(videoUploadPath+"/**")
                .addResourceLocations("file:" + videoUploadPath + "/");

        registry.addResourceHandler(thumbnailUploadPath+"/**")
                .addResourceLocations("file:" + thumbnailUploadPath + "/");
    }
}