package com.health.my.controller;

import com.health.my.dto.BoardDto;
import com.health.my.dto.UserDto;
import com.health.my.mapper.UserMapper;
import com.health.my.service.BookmarkService;
import com.health.my.service.LikeService;
import com.health.my.service.MyPageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/mypage")
public class MyPageController {

    private final UserMapper userMapper;
    private final MyPageService myPageService;
    private final LikeService likeService;
    private final BookmarkService bookmarkService;

    @Autowired
    public MyPageController(UserMapper userMapper, MyPageService myPageService, 
                           LikeService likeService, BookmarkService bookmarkService) {
        this.userMapper = userMapper;
        this.myPageService = myPageService;
        this.likeService = likeService;
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public String myPage(Model model) {
        // 현재 로그인한 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // 사용자 정보 조회
        UserDto user = userMapper.findByUsername(username);
        if (user == null) {
            return "redirect:/login";
        }
        
        // 내가 작성한 게시글 목록 조회
        List<BoardDto> myPosts = myPageService.getMyPosts(user.getUserId());
        
        // 좋아요한 게시글 목록 조회
        List<BoardDto> likedPosts = likeService.getLikedBoardsByUserId(user.getUserId());
        
        // 북마크한 게시글 목록 조회
        List<BoardDto> bookmarkedPosts = bookmarkService.getBookmarkedBoardsByUserId(user.getUserId());
        
        model.addAttribute("user", user);
        model.addAttribute("myPosts", myPosts);
        model.addAttribute("likedPosts", likedPosts);
        model.addAttribute("bookmarkedPosts", bookmarkedPosts);
        
        return "mypage/main";
    }
    
    @PostMapping("/update")
    public String updateProfile(@RequestParam String nickname,
                               @RequestParam(required = false) MultipartFile profileImage,
                               @RequestParam String currentPassword,
                               @RequestParam(required = false) String newPassword,
                               @RequestParam(required = false) String confirmNewPassword,
                               RedirectAttributes redirectAttributes) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        try {
            myPageService.updateUserProfile(username, nickname, profileImage, 
                                           currentPassword, newPassword, confirmNewPassword);
            redirectAttributes.addFlashAttribute("message", "프로필이 성공적으로 업데이트되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        
        return "redirect:/mypage";
    }
}