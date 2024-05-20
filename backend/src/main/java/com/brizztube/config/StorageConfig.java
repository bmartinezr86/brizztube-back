package com.brizztube.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class StorageConfig {
    @Value("${upload.video.path}")
    private String uploadVideosPath;

    @Value("${upload.thumbnail.path}")
    private String uploadThumbnailsPath;

    @Bean
    CommandLineRunner init() {
        return (args) -> {
            try {
                Path videosLocation = Paths.get(uploadVideosPath);
                Files.createDirectories(videosLocation);

                Path thumbnailsLocation = Paths.get(uploadThumbnailsPath);
                Files.createDirectories(thumbnailsLocation);
            } catch (Exception e) {
                throw new RuntimeException("Could not initialize storage", e);
            }
        };
    }
}