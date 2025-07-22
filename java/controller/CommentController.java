package com.health.my.controller;

import com.health.my.dto.CommentDto;
import com.health.my.dto.UserDto;
import com.health.my.mapper.UserMapper;
import com.health.my.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;
    private final UserMapper userMapper;

    @Autowired
    public CommentController(CommentService commentService, UserMapper userMapper) {
        this.commentService = commentService;
        this.userMapper = userMapper;
    }

    // 게시글의 댓글 목록 조회
    @GetMapping("/list/{boardId}")
    @ResponseBody
    public ResponseEntity<List<CommentDto>> getCommentList(@PathVariable Long boardId) {
        // 현재 로그인한 사용자 정보 확인
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        List<CommentDto> comments = commentService.getCommentsByBoardId(boardId, currentUsername);
        return ResponseEntity.ok(comments);
    }

    // 댓글 작성
    @PostMapping("/write")
    @ResponseBody
    public ResponseEntity<?> writeComment(@Valid @RequestBody CommentDto commentDto) {
        try {
            // 현재 로그인한 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // 사용자 정보 조회
            UserDto userDto = userMapper.findByUsername(username);
            
            // 댓글 DTO에 사용자 정보 설정
            commentDto.setUserId(userDto.getUserId());
            
            // 댓글 저장
            commentService.createComment(commentDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "댓글이 등록되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "댓글 등록에 실패했습니다: " + e.getMessage()));
        }
    }

    // 댓글 수정
    @PutMapping("/update/{commentId}")
    @ResponseBody
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, 
                                           @Valid @RequestBody CommentDto commentDto) {
        try {
            // 현재 로그인한 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // 댓글 ID 설정
            commentDto.setCommentId(commentId);
            
            // 댓글 수정
            commentService.updateComment(commentDto, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "댓글이 수정되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "댓글 수정에 실패했습니다: " + e.getMessage()));
        }
    }

    // 댓글 삭제
    @DeleteMapping("/delete/{commentId}")
    @ResponseBody
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            // 현재 로그인한 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // 댓글 삭제
            commentService.deleteComment(commentId, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "댓글이 삭제되었습니다.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "댓글 삭제에 실패했습니다: " + e.getMessage()));
        }
    }
}