package com.health.my.service;

import com.health.my.dto.BoardDto;
import com.health.my.dto.UserDto;
import com.health.my.mapper.BoardMapper;
import com.health.my.mapper.BookmarkMapper;
import com.health.my.mapper.LikeMapper;
import com.health.my.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final UserMapper userMapper;
    private final BoardMapper boardMapper;
    private final LikeMapper likeMapper;
    private final BookmarkMapper bookmarkMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${file.upload.directory}")
    private String uploadDir;

    /**
     * 내가 작성한 게시글 목록 조회
     */
    public List<BoardDto> getMyPosts(Long userId) {
        return boardMapper.findByUserId(userId);
    }

    /**
     * 내가 좋아요 누른 게시글 목록 조회
     */
    public List<BoardDto> getLikedPosts(Long userId) {
        return likeMapper.findBoardsByUserId(userId);
    }

    /**
     * 내가 스크랩한 게시글 목록 조회
     */
    public List<BoardDto> getBookmarkedPosts(Long userId) {
        return bookmarkMapper.findBoardsByUserId(userId);
    }

    /**
     * 사용자 프로필 업데이트
     */
    @Transactional
    public void updateUserProfile(String username, String nickname, MultipartFile profileImage,
                                 String currentPassword, String newPassword, String confirmNewPassword) throws Exception {
        
        // 사용자 조회
        UserDto user = userMapper.findByUsername(username);
        if (user == null) {
            throw new Exception("사용자를 찾을 수 없습니다.");
        }
        
        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new Exception("현재 비밀번호가 일치하지 않습니다.");
        }
        
        // 닉네임 업데이트
        user.setNickname(nickname);
        
        // 프로필 이미지 업데이트 (업로드된 경우)
        if (profileImage != null && !profileImage.isEmpty()) {
            String profileImagePath = saveProfileImage(profileImage);
            user.setProfileImage(profileImagePath);
        }
        
        // 비밀번호 변경 (입력된 경우)
        if (StringUtils.hasText(newPassword)) {
            if (!newPassword.equals(confirmNewPassword)) {
                throw new Exception("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            }
            
            // 비밀번호 업데이트
            userMapper.updatePassword(user.getUserId(), passwordEncoder.encode(newPassword));
        }
        
        // 사용자 정보 업데이트
        userMapper.updateUser(user);
    }

    /**
     * 프로필 이미지 저장
     */
    private String saveProfileImage(MultipartFile file) throws IOException {
        // 업로드 디렉토리 생성
        String profileUploadPath = uploadDir + "profiles/";
        File directory = new File(profileUploadPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 파일명 생성 (UUID + 원본 확장자)
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String savedFilename = UUID.randomUUID().toString() + extension;

        // 파일 저장
        Path filePath = Paths.get(profileUploadPath + savedFilename);
        Files.write(filePath, file.getBytes());

        // 웹에서 접근 가능한 경로 반환
        return "/uploads/profiles/" + savedFilename;
    }
}
