package com.health.my.mapper;

import com.health.my.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    /**
     * 사용자 등록
     */
    void insertUser(UserDto userDto);

    /**
     * 사용자 ID로 조회
     */
    UserDto findById(@Param("userId") Long userId);

    /**
     * 사용자명(아이디)으로 조회
     */
    UserDto findByUsername(@Param("username") String username);

    /**
     * 이메일로 조회
     */
    UserDto findByEmail(@Param("email") String email);

    /**
     * 사용자 정보 수정
     */
    void updateUser(UserDto userDto);

    /**
     * 비밀번호 변경
     */
    void updatePassword(@Param("userId") Long userId, @Param("password") String password);

    /**
     * 프로필 이미지 업데이트
     */
    void updateProfileImage(@Param("userId") Long userId, @Param("profileImage") String profileImage);
}