package com.brizztube.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${upload.video.path}")
    private String videoUploadPath;

    @Value("${upload.thumbnail.path}")
    private String thumbnailUploadPath;
    
    @Value("${upload.avatar.path}")
    private String avatarUploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(videoUploadPath+"/**")
                .addResourceLocations("file:" + videoUploadPath + "/");

        registry.addResourceHandler(thumbnailUploadPath+"/**")
                .addResourceLocations("file:" + thumbnailUploadPath + "/");
        
        registry.addResourceHandler(avatarUploadPath+"/**")
        .addResourceLocations("file:" + avatarUploadPath + "/");
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}