package com.health.my.service;

import com.health.my.dto.CommentDto;
import com.health.my.dto.UserDto;
import com.health.my.mapper.CommentMapper;
import com.health.my.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserMapper userMapper;

    @Autowired
    public CommentServiceImpl(CommentMapper commentMapper, UserMapper userMapper) {
        this.commentMapper = commentMapper;
        this.userMapper = userMapper;
    }

    @Override
    public List<CommentDto> getCommentsByBoardId(Long boardId, String currentUsername) {
        List<CommentDto> comments = commentMapper.getCommentsByBoardId(boardId);
        
        // 현재 로그인한 사용자가 작성한 댓글인지 확인
        if (currentUsername != null && !currentUsername.equals("anonymousUser")) {
            for (CommentDto comment : comments) {
                comment.setAuthor(comment.getUsername().equals(currentUsername));
            }
        }
        
        return comments;
    }

    @Override
    public CommentDto getCommentById(Long commentId) {
        return commentMapper.getCommentById(commentId);
    }

    @Override
    public void createComment(CommentDto commentDto) {
        commentMapper.insertComment(commentDto);
    }

    @Override
    public void updateComment(CommentDto commentDto, String currentUsername) {
        // 수정하려는 댓글 정보 조회
        CommentDto existingComment = commentMapper.getCommentById(commentDto.getCommentId());
        
        // 작성자 확인 (본인 댓글만 수정 가능)
        if (!existingComment.getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("댓글 작성자만 수정할 수 있습니다.");
        }
        
        commentMapper.updateComment(commentDto);
    }

    @Override
    public void deleteComment(Long commentId, String currentUsername) {
        // 삭제하려는 댓글 정보 조회
        CommentDto existingComment = commentMapper.getCommentById(commentId);
        
        // 작성자 확인 (본인 댓글만 삭제 가능)
        if (!existingComment.getUsername().equals(currentUsername)) {
            throw new AccessDeniedException("댓글 작성자만 삭제할 수 있습니다.");
        }
        
        commentMapper.deleteComment(commentId);
    }
}