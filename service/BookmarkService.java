package com.health.my.service;

import com.health.my.dto.BoardDto;
import com.health.my.mapper.BookmarkMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkMapper bookmarkMapper;

    @Autowired
    public BookmarkService(BookmarkMapper bookmarkMapper) {
        this.bookmarkMapper = bookmarkMapper;
    }

    /**
     * 게시글 북마크 토글 (이미 북마크가 있으면 취소, 없으면 추가)
     */
    @Transactional
    public boolean toggleBookmark(Long boardId, Long userId) {
        boolean isBookmarked = bookmarkMapper.existsByBoardIdAndUserId(boardId, userId);
        
        if (isBookmarked) {
            // 북마크 취소
            bookmarkMapper.deleteBookmark(boardId, userId);
            return false;
        } else {
            // 북마크 추가
            bookmarkMapper.insertBookmark(boardId, userId);
            return true;
        }
    }

    /**
     * 북마크 여부 확인
     */
    public boolean isBookmarkedByUser(Long boardId, Long userId) {
        return bookmarkMapper.existsByBoardIdAndUserId(boardId, userId);
    }

    /**
     * 사용자가 북마크한 게시글 목록 조회
     */
    public List<BoardDto> getBookmarkedBoardsByUserId(Long userId) {
        return bookmarkMapper.findBoardsByUserId(userId);
    }

    /**
     * 게시글의 북마크 수 조회
     */
    public int getBookmarkCount(Long boardId) {
        return bookmarkMapper.countByBoardId(boardId);
    }
}