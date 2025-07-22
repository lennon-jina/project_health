package com.health.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardDto {

    private Long boardId;

    private Long userId;

    private String username;
    private String nickname;

    @NotNull(message = "카테고리를 선택해주세요.")
    private Long categoryId;

    private String categoryName;

    @NotBlank(message = "제목을 입력해주세요.")
    @Size(min = 2, max = 100, message = "제목은 2~100자 사이로 입력해주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private String createdAt;
    private String updatedAt;

    // 이미지 파일 정보
    private List<ImageDto> images;

    // 좋아요, 북마크 여부 (현재 로그인한 사용자 기준)
    private boolean liked;
    private boolean bookmarked;
    
    private List<MultipartFile> files;
    
}