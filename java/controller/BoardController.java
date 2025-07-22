package com.health.my.controller;

import com.health.my.dto.BoardDto;
import com.health.my.dto.ImageDto;
import com.health.my.mapper.UserMapper;
import com.health.my.service.BoardService;
import com.health.my.service.BookmarkService;
import com.health.my.service.ImageService;
import com.health.my.service.LikeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import com.health.my.dto.UserDto;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;
    private final UserMapper userMapper;
    private final ImageService imageService;
    private final LikeService likeService;
    private final BookmarkService bookmarkService;

    @Autowired
    public BoardController(BoardService boardService, UserMapper userMapper, ImageService imageService, LikeService likeService, BookmarkService bookmarkService) {
        this.boardService = boardService;
        this.userMapper = userMapper;
        this.imageService = imageService;
        this.likeService = likeService;
        this.bookmarkService = bookmarkService;
    }

    // 게시글 목록 페이지
    @GetMapping("/list")
    public String boardList(Model model, 
                            @RequestParam(required = false) Long categoryId,
                            @RequestParam(required = false) String keyword,
                            @RequestParam(required = false, defaultValue = "all") String searchType) {
        
        List<BoardDto> boardList;
        
        if (categoryId != null) {
            // 카테고리별 조회
            boardList = boardService.getBoardsByCategory(categoryId);
            model.addAttribute("categoryId", categoryId);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            // 검색
            switch (searchType) {
                case "title":
                    boardList = boardService.searchBoardsByTitle(keyword);
                    break;
                case "content":
                    boardList = boardService.searchBoardsByContent(keyword);
                    break;
                default:
                    boardList = boardService.searchBoards(keyword); // 기존 검색 메서드 (제목+내용)
                    break;
            }
            model.addAttribute("keyword", keyword);
            model.addAttribute("searchType", searchType);
        } else {
            // 전체 조회
            boardList = boardService.getAllBoards();
        }
        
        model.addAttribute("boardList", boardList);
        return "board/list";
    }

    // 게시글 상세 페이지 메서드 수정
    @GetMapping("/detail/{boardId}")
    public String boardDetail(@PathVariable Long boardId, Model model) {
        // 현재 로그인한 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        // 조회수 증가
        boardService.increaseViewCount(boardId);
        
        // 게시글 상세 정보 조회
        BoardDto board = boardService.getBoardById(boardId);
        
        // 게시글에 속한 이미지 목록 조회
        List<ImageDto> images = imageService.getImagesByBoardId(boardId);
        board.setImages(images);
        
        // 현재 사용자의 좋아요, 북마크 상태 확인
        if (authentication != null && authentication.isAuthenticated() && !currentUsername.equals("anonymousUser")) {
            UserDto userDto = userMapper.findByUsername(currentUsername);
            if (userDto != null) {
                boolean isLiked = likeService.isLikedByUser(boardId, userDto.getUserId());
                boolean isBookmarked = bookmarkService.isBookmarkedByUser(boardId, userDto.getUserId());
                
                board.setLiked(isLiked);
                board.setBookmarked(isBookmarked);
            }
        }
        
        model.addAttribute("board", board);
        
        return "board/detail";
    }

    // 게시글 작성 폼
    @GetMapping("/write")
    public String boardWriteForm(Model model) {
        model.addAttribute("boardDto", new BoardDto());
        return "board/write";
    }

    // 게시글 작성 처리
    @PostMapping("/write")
    public String boardWrite(@Valid BoardDto boardDto,
                             BindingResult bindingResult,
                             @RequestParam(value = "files", required = false) List<MultipartFile> files) {
    	
    	System.out.println("🔥 Controller 도달 체크");

        if (bindingResult.hasErrors()) {
        	System.out.println("❌ 바인딩 오류 발생:");
        	bindingResult.getAllErrors().forEach(error -> {
                System.out.println(" - " + error.getDefaultMessage());
            });
            return "board/write";
        }

        // Spring Security의 Authentication에서 사용자 이름(username) 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("🔥 Authentication 정보: " + authentication);
        System.out.println("🔥 isAuthenticated: " + authentication.isAuthenticated());
        
        String username = authentication.getName();
        System.out.println("🔥 현재 로그인한 사용자명: " + username);
        
        // UserMapper를 통해 username으로 사용자 정보 조회
        UserDto userDto = userMapper.findByUsername(username);

        boardDto.setUserId(userDto.getUserId());

        // 게시글 저장 후 생성된 게시글 ID 가져오기
        Long boardId = boardService.createBoard(boardDto);
        
        // 이미지 파일이 있는 경우 처리
        if (files != null && !files.isEmpty()) {
            // 빈 파일이 아닌 것만 필터링
            List<MultipartFile> validFiles = files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();
            
            if (!validFiles.isEmpty()) {
                System.out.println("📸 이미지 파일 업로드 시작");
                List<ImageDto> savedImages = imageService.uploadImages(validFiles, boardId);
                System.out.println("📸 업로드된 이미지 수: " + savedImages.size());
            }
        }
        
        System.out.println("✅ 게시글 등록 성공!");
        
        return "redirect:/board/list";
    }

    // 게시글 수정 폼
    @GetMapping("/edit/{boardId}")
    public String boardEditForm(@PathVariable Long boardId, Model model) {
        BoardDto board = boardService.getBoardById(boardId);
        
        // 게시글에 속한 이미지 목록 조회
        List<ImageDto> images = imageService.getImagesByBoardId(boardId);
        board.setImages(images);
        
        model.addAttribute("boardDto", board);
        return "board/edit";
    }

    // 게시글 수정 처리
    @PostMapping("/edit/{boardId}")
    public String boardEdit(@PathVariable Long boardId,
                           @Valid BoardDto boardDto,
                           BindingResult bindingResult,
                           @RequestParam(value = "files", required = false) List<MultipartFile> files,
                           @RequestParam(value = "deleteImageIds", required = false) List<Long> deleteImageIds) {
        
        if (bindingResult.hasErrors()) {
            return "board/edit";
        }
        
        boardDto.setBoardId(boardId);
        
        // 삭제할 이미지가 있는 경우
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            System.out.println("🗑️ 이미지 삭제 시작");
            for (Long imageId : deleteImageIds) {
                imageService.deleteImage(imageId);
            }
            System.out.println("🗑️ 이미지 삭제 완료: " + deleteImageIds.size() + "개");
        }
        
        // 게시글 정보 업데이트
        boardService.updateBoard(boardDto);
        
        // 새로운 이미지 파일이 있는 경우 처리
        if (files != null && !files.isEmpty()) {
            // 빈 파일이 아닌 것만 필터링
            List<MultipartFile> validFiles = files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();
            
            if (!validFiles.isEmpty()) {
                System.out.println("📸 새 이미지 파일 업로드 시작");
                List<ImageDto> savedImages = imageService.uploadImages(validFiles, boardId);
                System.out.println("📸 업로드된 이미지 수: " + savedImages.size());
            }
        }
        
        return "redirect:/board/detail/" + boardId;
    }

    // 게시글 삭제
    @GetMapping("/delete/{boardId}")
    public String boardDelete(@PathVariable Long boardId) {
        // 게시글에 속한 이미지 파일 먼저 삭제
        imageService.deleteImagesByBoardId(boardId);
        
        // 게시글 삭제
        boardService.deleteBoard(boardId);
        return "redirect:/board/list";
    }
    
 // 좋아요 토글 API
    @PostMapping("/like/{boardId}")
    @ResponseBody
    public Map<String, Object> toggleLike(@PathVariable Long boardId) {
        Map<String, Object> response = new HashMap<>();
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return response;
        }
        
        UserDto userDto = userMapper.findByUsername(authentication.getName());
        boolean isLiked = likeService.toggleLike(boardId, userDto.getUserId());
        int likeCount = likeService.getLikeCount(boardId);
        
        response.put("success", true);
        response.put("liked", isLiked);
        response.put("likeCount", likeCount);
        
        return response;
    }

    // 북마크 토글 API
    @PostMapping("/bookmark/{boardId}")
    @ResponseBody
    public Map<String, Object> toggleBookmark(@PathVariable Long boardId) {
        Map<String, Object> response = new HashMap<>();
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return response;
        }
        
        UserDto userDto = userMapper.findByUsername(authentication.getName());
        boolean isBookmarked = bookmarkService.toggleBookmark(boardId, userDto.getUserId());
        
        response.put("success", true);
        response.put("bookmarked", isBookmarked);
        
        return response;
    }
}