package com.health.my.mapper;

import com.health.my.dto.BoardDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {

    /**
     * 게시글 목록 조회
     */
    List<BoardDto> findAll();

    /**
     * 카테고리별 게시글 목록 조회
     */
    List<BoardDto> findByCategory(@Param("categoryId") Long categoryId);

    /**
     * 게시글 상세 조회
     */
    BoardDto findById(@Param("boardId") Long boardId);

    /**
     * 사용자별 게시글 목록 조회
     */
    List<BoardDto> findByUserId(@Param("userId") Long userId);

    /**
     * 게시글 검색 (제목, 내용)
     */
    List<BoardDto> search(@Param("keyword") String keyword);

    /**
     * 게시글 등록
     */
    void insertBoard(BoardDto boardDto);

    /**
     * 게시글 수정
     */
    void updateBoard(BoardDto boardDto);

    /**
     * 게시글 삭제
     */
    void deleteBoard(@Param("boardId") Long boardId);

    /**
     * 조회수 증가
     */
    void increaseViewCount(@Param("boardId") Long boardId);
    
    /**
     * 게시글 검색 (제목만)
     */
    List<BoardDto> searchByTitle(@Param("keyword") String keyword);

    /**
     * 게시글 검색 (내용만)
     */
    List<BoardDto> searchByContent(@Param("keyword") String keyword);

}