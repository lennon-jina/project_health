package com.health.my.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Component
public class PythonConnector {
    private final String PYTHON_API_URL = "http://localhost:5000/predict";
    private final String PYTHON_EXERCISE_API_URL = "http://localhost:5000/exercise/recommend";
    private final String GOOGLE_TRANSLATE_API_URL = "https://translation.googleapis.com/language/translate/v2";
    private final String GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // 구글 API 키 설정 필요
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public PythonConnector() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public Map<String, Object> predictDiabetes(Map<String, Object> inputData) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        // 파이썬 API 호출 시 모드 확인
        String mode = (String) inputData.get("mode");
        boolean isNormalMode = "normal".equals(mode);
        
        // 요청 데이터 생성 (개발 환경에서는 객체 자체를 전송)
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(inputData, headers);
        
        try {
            System.out.println("파이썬 API 요청 데이터: " + inputData);
            Map<String, Object> response = restTemplate.postForObject(PYTHON_API_URL, request, Map.class);
            System.out.println("Python API 응답: " + response);
            
            if (response == null) {
                throw new RuntimeException("파이썬 API가 null 응답을 반환했습니다.");
            }
            
            if (response.containsKey("error")) {
                throw new RuntimeException("파이썬 API 오류: " + response.get("error"));
            }
            
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "파이썬 API 호출 중 오류 발생: " + e.getMessage());
            errorResponse.put("probability", 0.0);
            errorResponse.put("risk", "알 수 없음");
            return errorResponse;
        }
    }
    
    public Map<String, Object> getExerciseRecommendations(String riskLevel) {
        try {
            // Python 서버에서 운동 추천 받기
            String url = UriComponentsBuilder.fromHttpUrl(PYTHON_EXERCISE_API_URL)
                    .queryParam("risk_level", convertRiskLevelToKorean(riskLevel))
                    .build()
                    .toUriString();
                    
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            System.out.println("운동 추천 API 응답: " + response);
            
            if (response == null) {
                throw new RuntimeException("파이썬 API가 null 응답을 반환했습니다.");
            }
            
            if (response.containsKey("error")) {
                throw new RuntimeException("파이썬 API 오류: " + response.get("error"));
            }
            
            // Python 응답 데이터 처리
            List<Map<String, Object>> originalExercises = (List<Map<String, Object>>) response.get("exercises");
            List<Map<String, Object>> processedExercises = new ArrayList<>();
            
            for (Map<String, Object> exercise : originalExercises) {
                Map<String, Object> processedExercise = new HashMap<>();
                
                // 기본 정보 복사
                processedExercise.put("name_en", exercise.get("name"));
                processedExercise.put("bodyPart_en", exercise.getOrDefault("bodyPart", ""));
                processedExercise.put("equipment_en", exercise.getOrDefault("equipment", ""));
                processedExercise.put("gifUrl", exercise.getOrDefault("gifUrl", ""));
                
                // 한글 번역 추가
                processedExercise.put("name_ko", translateToKorean((String) exercise.get("name")));
                
                if (exercise.containsKey("bodyPart")) {
                    processedExercise.put("bodyPart_ko", translateToKorean((String) exercise.get("bodyPart")));
                }
                
                if (exercise.containsKey("equipment")) {
                    processedExercise.put("equipment_ko", translateToKorean((String) exercise.get("equipment")));
                }
                
                // 운동 지침 처리
                if (exercise.containsKey("instructions")) {
                    Object instructions = exercise.get("instructions");
                    if (instructions instanceof List) {
                        List<String> instructionList = (List<String>) instructions;
                        List<String> translatedInstructions = new ArrayList<>();
                        
                        for (String instruction : instructionList) {
                            // 이미 한글인지 확인
                            if (containsKorean(instruction)) {
                                translatedInstructions.add(instruction);
                            } else {
                                translatedInstructions.add(translateToKorean(instruction));
                            }
                        }
                        
                        processedExercise.put("instructions_en", instructionList);
                        processedExercise.put("instructions_ko", translatedInstructions);
                    }
                }
                
                processedExercises.add(processedExercise);
            }
            
            // 응답 구성
            Map<String, Object> result = new HashMap<>();
            result.put("exercises", processedExercises);
            result.put("risk_level", riskLevel);
            
            // 메시지가 있으면 추가
            if (response.containsKey("message")) {
                result.put("message", response.get("message"));
                result.put("message_ko", translateToKorean((String) response.get("message")));
            }
            
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            // 오류 발생 시 빈 응답 반환
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("exercises", Collections.emptyList());
            emptyResponse.put("risk_level", riskLevel);
            emptyResponse.put("error", e.getMessage());
            return emptyResponse;
        }
    }
    
    // 위험 수준을 영어에서 한글로 변환
    private String convertRiskLevelToKorean(String riskLevel) {
        switch (riskLevel.toLowerCase()) {
            case "low":
                return "낮음";
            case "medium":
                return "보통";
            case "high":
                return "고위험";
            case "very_high":
                return "매우 위험";
            default:
                return riskLevel; // 기본값은 그대로 반환
        }
    }
    
    // 텍스트에 한글이 포함되어 있는지 확인
    private boolean containsKorean(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        
        for (char c : text.toCharArray()) {
            if (Character.UnicodeBlock.of(c) == Character.UnicodeBlock.HANGUL_SYLLABLES ||
                Character.UnicodeBlock.of(c) == Character.UnicodeBlock.HANGUL_COMPATIBILITY_JAMO ||
                Character.UnicodeBlock.of(c) == Character.UnicodeBlock.HANGUL_JAMO) {
                return true;
            }
        }
        return false;
    }
    
    private String translateToKorean(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        
        // 이미 한글이면 번역하지 않음
        if (containsKorean(text)) {
            return text;
        }
        
        try {
            // 구글 번역 API 요청 (API 키가 없는 경우 간단한 변환만 수행)
            if (GOOGLE_API_KEY == null || GOOGLE_API_KEY.equals("YOUR_GOOGLE_API_KEY")) {
                // 기본 영어->한글 매핑
                Map<String, String> basicTranslations = new HashMap<>();
                basicTranslations.put("Push-ups", "팔굽혀펴기");
                basicTranslations.put("Squats", "스쿼트");
                basicTranslations.put("Lunges", "런지");
                basicTranslations.put("Plank", "플랭크");
                basicTranslations.put("Mountain Climbers", "마운틴 클라이머");
                basicTranslations.put("Wall Sit", "월 싯");
                
                return basicTranslations.getOrDefault(text, text + " (번역 필요)");
            }
            
            // 구글 번역 API 요청
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("q", text);
            requestBody.put("source", "en");
            requestBody.put("target", "ko");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // API 호출 URL에 API 키 추가
            String fullUrl = GOOGLE_TRANSLATE_API_URL + "?key=" + GOOGLE_API_KEY;
            
            Map<String, Object> response = restTemplate.postForObject(fullUrl, request, Map.class);
            
            if (response != null && response.containsKey("data")) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                List<Map<String, Object>> translations = (List<Map<String, Object>>) data.get("translations");
                
                if (!translations.isEmpty()) {
                    return (String) translations.get(0).get("translatedText");
                }
            }
            
            return text; // 번역 실패 시 원본 반환
        } catch (Exception e) {
            System.err.println("번역 중 오류 발생: " + e.getMessage());
            return text; // 오류 발생 시 원본 반환
        }
    }
    
}