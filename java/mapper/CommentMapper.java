package com.health.my.mapper;

import com.health.my.dto.CommentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    
    // 댓글 목록 조회
    List<CommentDto> getCommentsByBoardId(Long boardId);
    
    // 댓글 단일 조회
    CommentDto getCommentById(Long commentId);
    
    // 댓글 추가
    void insertComment(CommentDto commentDto);
    
    // 댓글 수정
    void updateComment(CommentDto commentDto);
    
    // 댓글 삭제
    void deleteComment(Long commentId);
    
    // 게시글의 모든 댓글 삭제 (게시글 삭제 시 호출)
    void deleteCommentsByBoardId(Long boardId);
}