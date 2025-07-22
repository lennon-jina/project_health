package com.health.my.service;

import com.health.my.dto.ImageDto;
import com.health.my.mapper.ImageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    @Autowired
    private ImageMapper imageMapper;

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    /**
     * 다중 이미지 파일 업로드 및 DB 저장
     * @param files 업로드할 이미지 파일들
     * @param boardId 게시글 ID
     * @return 저장된 이미지 목록
     */
    public List<ImageDto> uploadImages(List<MultipartFile> files, Long boardId) {
        List<ImageDto> savedImages = new ArrayList<>();
        
        if (files == null || files.isEmpty()) {
            return savedImages;
        }

        // 오늘 날짜로 폴더 생성 (YYYY-MM-DD)
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String savePath = uploadDirectory + File.separator + datePath;
        
        // 저장 디렉토리 생성
        File saveDir = new File(savePath);
        if (!saveDir.exists()) {
            saveDir.mkdirs();
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            
            try {
                // 원본 파일명과 확장자 추출
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                
                // UUID를 이용한 고유한 파일명 생성
                String savedFilename = UUID.randomUUID().toString() + extension;
                
                // 최종 저장 경로
                String fullPath = savePath + File.separator + savedFilename;
                Path targetPath = Paths.get(fullPath);
                
                // 파일 저장
                Files.copy(file.getInputStream(), targetPath);
                
                // DB에 이미지 정보 저장
                ImageDto imageDto = ImageDto.builder()
                        .boardId(boardId)
                        .originalName(originalFilename)
                        .savedPath(datePath + File.separator + savedFilename)
                        .fileSize(file.getSize())
                        .build();
                
                imageMapper.insertImage(imageDto);
                savedImages.add(imageDto);
                
            } catch (IOException e) {
                // 실제 환경에서는 로그 처리 및 예외 처리 필요
                e.printStackTrace();
            }
        }
        
        return savedImages;
    }

    /**
     * 이미지 파일 삭제
     * @param imageId 삭제할 이미지 ID
     * @return 삭제 성공 여부
     */
    public boolean deleteImage(Long imageId) {
        ImageDto imageDto = imageMapper.findImageById(imageId);
        if (imageDto == null) {
            return false;
        }
        
        // 실제 파일 삭제
        String fullPath = uploadDirectory + File.separator + imageDto.getSavedPath();
        File file = new File(fullPath);
        if (file.exists()) {
            file.delete();
        }
        
        // DB에서 이미지 정보 삭제
        imageMapper.deleteImage(imageId);
        return true;
    }

    /**
     * 게시글의 모든 이미지 삭제
     * @param boardId 게시글 ID
     */
    public void deleteImagesByBoardId(Long boardId) {
        List<ImageDto> images = imageMapper.findImagesByBoardId(boardId);
        
        // 실제 파일 삭제
        for (ImageDto image : images) {
            String fullPath = uploadDirectory + File.separator + image.getSavedPath();
            File file = new File(fullPath);
            if (file.exists()) {
                file.delete();
            }
        }
        
        // DB에서 이미지 정보 삭제
        imageMapper.deleteImagesByBoardId(boardId);
    }

    /**
     * 게시글에 속한 이미지 목록 조회
     * @param boardId 게시글 ID
     * @return 이미지 목록
     */
    public List<ImageDto> getImagesByBoardId(Long boardId) {
        return imageMapper.findImagesByBoardId(boardId);
    }
}