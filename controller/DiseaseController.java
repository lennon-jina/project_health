package com.health.my.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@CrossOrigin("*")
public class DiseaseController {

    @GetMapping("/api/kdca")
    public String getHealthInfo(@RequestParam String code) {
        try {
            // API 호출
            URL url = new URL("https://api.kdca.go.kr/api/provide/healthInfo?TOKEN=19680ea972b9&cntntsSn=" + code);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            
            // 응답 읽기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            StringBuilder response = new StringBuilder();
            String line;
            
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            br.close();
            
            return response.toString();
            
        } catch (Exception e) {
            e.printStackTrace();
            return "<error>" + e.getMessage() + "</error>";
        }
    }
}