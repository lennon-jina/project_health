package com.health.my.mapper;

import com.health.my.dto.ImageDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ImageMapper {
    // 이미지 저장
    void insertImage(ImageDto imageDto);
    
    // 게시글에 속한 이미지 목록 조회
    List<ImageDto> findImagesByBoardId(Long boardId);
    
    // 이미지 삭제
    void deleteImage(Long imageId);
    
    // 게시글에 속한 모든 이미지 삭제
    void deleteImagesByBoardId(Long boardId);
    
    // 이미지 정보 조회
    ImageDto findImageById(Long imageId);
}
