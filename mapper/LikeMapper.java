package com.health.my.mapper;

import com.health.my.dto.BoardDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LikeMapper {

    /**
     * 좋아요 등록
     */
    void insertLike(@Param("boardId") Long boardId, @Param("userId") Long userId);

    /**
     * 좋아요 취소
     */
    void deleteLike(@Param("boardId") Long boardId, @Param("userId") Long userId);

    /**
     * 좋아요 여부 확인
     */
    boolean existsByBoardIdAndUserId(@Param("boardId") Long boardId, @Param("userId") Long userId);

    /**
     * 사용자가 좋아요 누른 게시글 목록
     */
    List<BoardDto> findBoardsByUserId(@Param("userId") Long userId);
    
    /**
     * 게시글의 좋아요 수
     */
    int countByBoardId(@Param("boardId") Long boardId);
}
