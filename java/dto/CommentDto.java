package com.health.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    
    private Long commentId;
    
    private Long boardId;
    
    private Long userId;
    
    private String username;  // 댓글 작성자의 아이디
    
    private String nickname;  // 댓글 작성자의 닉네임
    
    @NotBlank(message = "댓글 내용은 필수입니다.")
    @Size(max = 1000, message = "댓글은 1000자를 넘을 수 없습니다.")
    private String content;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // 현재 로그인한 사용자가 작성한 댓글인지 확인하는 필드
    private boolean isAuthor;
}