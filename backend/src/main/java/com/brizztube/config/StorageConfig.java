package com.brizztube.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class StorageConfig {
	private final Path rootLocation = Paths.get("upload-videos");

    @Bean
    CommandLineRunner init() {
        return (args) -> {
            try {
                Files.createDirectories(rootLocation);
            } catch (Exception e) {
                throw new RuntimeException("Could not initialize storage", e);
            }
        };
    }
}
