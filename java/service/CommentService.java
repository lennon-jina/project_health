package com.health.my.service;

import com.health.my.dto.CommentDto;

import java.util.List;

public interface CommentService {
    
    // 게시글에 달린 댓글 목록 조회
    List<CommentDto> getCommentsByBoardId(Long boardId, String currentUsername);
    
    // 댓글 단일 조회
    CommentDto getCommentById(Long commentId);
    
    // 댓글 작성
    void createComment(CommentDto commentDto);
    
    // 댓글 수정
    void updateComment(CommentDto commentDto, String currentUsername);
    
    // 댓글 삭제
    void deleteComment(Long commentId, String currentUsername);
}