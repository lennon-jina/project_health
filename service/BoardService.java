package com.health.my.service;
import com.health.my.dto.BoardDto;
import com.health.my.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class BoardService {
    private final BoardMapper boardMapper;
    @Autowired
    public BoardService(BoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }
    // 전체 게시글 목록 조회
    public List<BoardDto> getAllBoards() {
        return boardMapper.findAll();
    }
    // 카테고리별 게시글 목록 조회
    public List<BoardDto> getBoardsByCategory(Long categoryId) {
        return boardMapper.findByCategory(categoryId);
    }
    // 게시글 상세 조회
    public BoardDto getBoardById(Long boardId) {
        return boardMapper.findById(boardId);
    }
    // 사용자별 게시글 목록 조회
    public List<BoardDto> getBoardsByUserId(Long userId) {
        return boardMapper.findByUserId(userId);
    }
    // 게시글 검색
    public List<BoardDto> searchBoards(String keyword) {
        return boardMapper.search(keyword);
    }
    // 게시글 등록 (boardId 반환하도록 수정)
    public Long createBoard(BoardDto boardDto) {
        boardMapper.insertBoard(boardDto);
        return boardDto.getBoardId(); // MyBatis의 selectKey로 반환된 ID 값
    }
    // 게시글 수정
    public void updateBoard(BoardDto boardDto) {
        boardMapper.updateBoard(boardDto);
    }
    // 게시글 삭제
    public void deleteBoard(Long boardId) {
        boardMapper.deleteBoard(boardId);
    }
    // 조회수 증가
    public void increaseViewCount(Long boardId) {
        boardMapper.increaseViewCount(boardId);
    }
    // 제목으로 게시글 검색
    public List<BoardDto> searchBoardsByTitle(String keyword) {
        return boardMapper.searchByTitle(keyword);
    }

    // 내용으로 게시글 검색
    public List<BoardDto> searchBoardsByContent(String keyword) {
        return boardMapper.searchByContent(keyword);
    }

}