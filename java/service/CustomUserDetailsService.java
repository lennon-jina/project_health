package com.health.my.service;

import com.health.my.dto.UserDto;
import com.health.my.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자 정보 조회
        UserDto userDto = userMapper.findByUsername(username);
        
        if (userDto == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }

        // Spring Security의 User 객체 생성
        return new User(
                userDto.getUsername(),
                userDto.getPassword(),
                userDto.isEnabled(),
                true, true, true,
                Collections.singleton(new SimpleGrantedAuthority(userDto.getRole()))
        );
    }
}