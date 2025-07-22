package com.health.my.controller;

import com.health.my.dto.UserDto;
import com.health.my.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 로그인 페이지
    @GetMapping("/login")
    public String loginForm() {
        return "user/login";
    }

    // 회원가입 처리
    @PostMapping("/register")
    public String registerProcess(
            @Validated @ModelAttribute UserDto userDto,
            BindingResult bindingResult,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam("confirmPassword") String confirmPassword,
            Model model,
            RedirectAttributes redirectAttributes) {

        // 비밀번호 일치 확인
        if (!userDto.getPassword().equals(confirmPassword)) {
            model.addAttribute("passwordMismatch", "비밀번호가 일치하지 않습니다.");
            return "user/login";
        }

        // 유효성 검사 실패 시
        if (bindingResult.hasErrors()) {
            return "user/login";
        }

        try {
            // 사용자 등록 처리
            userService.registerUser(userDto, profileImage);
            redirectAttributes.addFlashAttribute("message", "회원가입이 완료되었습니다. 로그인해주세요.");
            return "redirect:/login";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "user/login";
        }
    }
}