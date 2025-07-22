package com.health.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long userId;

    @NotBlank(message = "아이디는 필수 입력 항목입니다.")
    @Size(min = 4, max = 20, message = "아이디는 4~20자 사이로 입력해주세요.")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "아이디는 영문, 숫자, 언더스코어(_)만 사용 가능합니다.")
    private String username;

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, max = 13, message = "비밀번호는 8~13자 사이로 입력해주세요.")
    private String password;

    @NotBlank(message = "이메일은 필수 입력 항목입니다.")
    @Email(message = "유효한 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
    @Size(min = 2, max = 10, message = "닉네임은 2~10자 사이로 입력해주세요.")
    private String nickname;

    private String profileImage;
    private String role;
    private boolean enabled;
    private String createdAt;
    private String updatedAt;
}
