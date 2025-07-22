package com.health.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageDto {
    private Long imageId;
    private Long boardId;
    private String originalName;
    private String savedPath;
    private Long fileSize;
    private String createdAt;
}