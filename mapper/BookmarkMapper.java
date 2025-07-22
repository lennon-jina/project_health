package com.health.my.mapper;

import com.health.my.dto.BoardDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BookmarkMapper {

    /**
     * 북마크 등록
     */
    void insertBookmark(@Param("boardId") Long boardId, @Param("userId") Long userId);

    /**
     * 북마크 취소
     */
    void deleteBookmark(@Param("boardId") Long boardId, @Param("userId") Long userId);

    /**
     * 북마크 여부 확인
     */
    boolean existsByBoardIdAndUserId(@Param("boardId") Long boardId, @Param("userId") Long userId);

    /**
     * 사용자가 북마크한 게시글 목록
     */
    List<BoardDto> findBoardsByUserId(@Param("userId") Long userId);
    
    /**
     * 게시글의 북마크 수
     */
    int countByBoardId(@Param("boardId") Long boardId);
}