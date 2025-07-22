package com.health.my.service;

import com.health.my.dto.BoardDto;
import com.health.my.mapper.BoardMapper;
import com.health.my.mapper.LikeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LikeService {

    private final LikeMapper likeMapper;
    private final BoardMapper boardMapper;

    @Autowired
    public LikeService(LikeMapper likeMapper, BoardMapper boardMapper) {
        this.likeMapper = likeMapper;
        this.boardMapper = boardMapper;
    }

    /**
     * 게시글 좋아요 토글 (이미 좋아요가 있으면 취소, 없으면 추가)
     */
    @Transactional
    public boolean toggleLike(Long boardId, Long userId) {
        boolean isLiked = likeMapper.existsByBoardIdAndUserId(boardId, userId);
        
        if (isLiked) {
            // 좋아요 취소
            likeMapper.deleteLike(boardId, userId);
            return false;
        } else {
            // 좋아요 추가
            likeMapper.insertLike(boardId, userId);
            return true;
        }
    }

    /**
     * 좋아요 여부 확인
     */
    public boolean isLikedByUser(Long boardId, Long userId) {
        return likeMapper.existsByBoardIdAndUserId(boardId, userId);
    }

    /**
     * 사용자가 좋아요 누른 게시글 목록 조회
     */
    public List<BoardDto> getLikedBoardsByUserId(Long userId) {
        return likeMapper.findBoardsByUserId(userId);
    }

    /**
     * 게시글의 좋아요 수 조회
     */
    public int getLikeCount(Long boardId) {
        return likeMapper.countByBoardId(boardId);
    }
}