package com.health.my.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${file.upload.directory}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드 파일에 대한 접근 경로 설정
        Path uploadPath = Paths.get(uploadDir);
        String uploadAbsolutePath = uploadPath.toFile().getAbsolutePath();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadAbsolutePath + "/");
    }
    
    // CORS 설정 추가
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // 모든 출처 허용 (개발용)
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(false)
                .maxAge(3600); // 1시간 동안 preflight 요청 캐싱
    }
}