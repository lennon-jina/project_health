package com.health.my.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    private final String serviceKey = "f82yPXMXNwVt%2Bs0bhbI6wzLIZDCJ%2FE5qXCVZc6YCiU2r%2F9c9mT8aX5v6E9wTaNqWIRKusEqdAmc2KOp23FetzA%3D%3D";
    private final String sgApim = "2ug8Dm9qNBfD32JLZGPN64f3EoTlkpD8kSOHWfXpyrY";

    // 1. 음식 이름으로 food_Code 검색
    @GetMapping("/code")
    public ResponseEntity<String> searchFoodCode(@RequestParam String foodName) {
        try {
            if (foodName == null || foodName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("<response><header><result_Code>400</result_Code><result_Msg>음식 이름이 제공되지 않았습니다.</result_Msg></header></response>");
            }
            
            // URL 인코딩 - 서비스키는 이미 인코딩되어 있으므로 인코딩하지 않음
            String encodedFoodName = URLEncoder.encode(foodName.trim(), StandardCharsets.UTF_8);
            
            // URL 생성
            String urlStr = "https://api.naas.go.kr/service/AgriFood/MzenFoodCode/getKoreanFoodList"
                    + "?serviceKey=" + serviceKey
                    + "&food_Name=" + encodedFoodName
                    + "&SG_APIM=" + sgApim
                    + "&Page_No=1"
                    + "&Page_Size=30";
            
            System.out.println("첫 번째 API URL: " + urlStr);
            
            // HttpURLConnection 사용 (RestTemplate 대신)
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/xml");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            System.out.println("응답 코드: " + conn.getResponseCode());
            
            // 응답 읽기
            BufferedReader reader;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                reader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
            }
            
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            System.out.println("첫 번째 API 응답 내용: " + response.toString());
            
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("<response><header><result_Code>500</result_Code><result_Msg>" + e.getMessage() + "</result_Msg></header></response>");
        }
    }

    // 2. food_Code로 영양성분 상세 조회
    @GetMapping("/nutrition")
    public ResponseEntity<String> searchFoodNutrition(@RequestParam String foodCode) {
        try {
            if (foodCode == null || foodCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("<response><header><result_Code>400</result_Code><result_Msg>식품 코드가 제공되지 않았습니다.</result_Msg></header></response>");
            }
            
            // URL 생성
            String urlStr = "https://apis.data.go.kr/1390802/AgriFood/MzenFoodNutri/getKoreanFoodIdntList"
                    + "?serviceKey=" + serviceKey
                    + "&food_Code=" + foodCode.trim();
            
            System.out.println("두 번째 API URL: " + urlStr);
            
            // HttpURLConnection 사용 (RestTemplate 대신)
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/xml");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            System.out.println("응답 코드: " + conn.getResponseCode());
            
            // 응답 읽기
            BufferedReader reader;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                reader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
            }
            
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            System.out.println("두 번째 API 응답 내용: " + response.toString());
            
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("<response><header><result_Code>500</result_Code><result_Msg>" + e.getMessage() + "</result_Msg></header></response>");
        }
    }
    
    // 3. 카테고리별 음식 목록 조회 (검색어 파라미터 추가)
    @GetMapping("/category")
    public ResponseEntity<String> searchFoodsByCategory(
            @RequestParam String categoryCode,
            @RequestParam(required = false) String foodName) {
        try {
            if (categoryCode == null || categoryCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("<response><header><result_Code>400</result_Code><result_Msg>식품분류 코드가 제공되지 않았습니다.</result_Msg></header></response>");
            }
            
            // URL 생성
            StringBuilder urlStrBuilder = new StringBuilder();
            urlStrBuilder.append("https://api.naas.go.kr/service/AgriFood/MzenFoodCode/getKoreanFoodList")
                    .append("?serviceKey=").append(serviceKey)
                    .append("&SG_APIM=").append(sgApim)
                    .append("&Page_No=1")
                    .append("&Page_Size=100")
                    .append("&food_Group_Code=").append(categoryCode.trim());
            
            // 검색어가 제공된 경우 URL에 추가
            if (foodName != null && !foodName.trim().isEmpty()) {
                String encodedFoodName = URLEncoder.encode(foodName.trim(), StandardCharsets.UTF_8);
                urlStrBuilder.append("&food_Name=").append(encodedFoodName);
            }
            
            String urlStr = urlStrBuilder.toString();
            System.out.println("카테고리 API URL: " + urlStr);
            
            // HttpURLConnection 사용
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/xml");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            System.out.println("응답 코드: " + conn.getResponseCode());
            
            // 응답 읽기
            BufferedReader reader;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                reader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
            }
            
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();
            
            System.out.println("카테고리 API 응답 내용: " + response.toString());
            
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("<response><header><result_Code>500</result_Code><result_Msg>" + e.getMessage() + "</result_Msg></header></response>");
        }
    }
}