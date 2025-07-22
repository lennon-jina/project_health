package com.health.my.service;

import com.health.my.dto.UserDto;
import com.health.my.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${file.upload.directory}")
    private String uploadDir;

    /**
     * 회원 등록
     */
    @Transactional
    public void registerUser(UserDto userDto, MultipartFile profileImage) throws Exception {
        // 아이디 중복 확인
        if (userMapper.findByUsername(userDto.getUsername()) != null) {
            throw new Exception("이미 사용 중인 아이디입니다.");
        }

        // 이메일 중복 확인
        if (userMapper.findByEmail(userDto.getEmail()) != null) {
            throw new Exception("이미 사용 중인 이메일입니다.");
        }

        // 프로필 이미지 처리
        if (profileImage != null && !profileImage.isEmpty()) {
            String profileImagePath = saveProfileImage(profileImage);
            userDto.setProfileImage(profileImagePath);
        }

        // 비밀번호 암호화
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        
        // 기본 권한 설정
        userDto.setRole("ROLE_USER");
        userDto.setEnabled(true);

        // 사용자 저장
        userMapper.insertUser(userDto);
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

    /**
     * 아이디로 사용자 조회
     */
    public UserDto getUserByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    /**
     * 이메일로 사용자 조회
     */
    public UserDto getUserByEmail(String email) {
        return userMapper.findByEmail(email);
    }

    /**
     * 사용자 ID로 사용자 조회
     */
    public UserDto getUserById(Long userId) {
        return userMapper.findById(userId);
    }
}