package com.health.my.dto;

import lombok.Data;

@Data
public class DiabetesDto {
    // 입력 모드 (expert 또는 normal)
    private String mode;
    
    // 전문가용 입력 필드 (원래 있던 필드)
    private Integer pregnancies;     // 임신 횟수
    private Integer glucose;         // 포도당 농도
    private Integer bloodPressure;   // 혈압
    private Integer skinThickness;   // 피부 두께
    private Integer insulin;         // 인슐린
    private Float bmi;               // 체질량 지수
    private Float diabetesPedigreeFunction; // 당뇨병 가족력 함수
    private Integer age;             // 나이
    
    // 예측 결과
    private Double probability;      // 당뇨병 확률
    private String riskLevel;        // 위험 수준
    
    // 일반인용 추가 필드
    private String glucoseOption;    // 포도당 관련 옵션 (high, normal, unknown)
    private String bpOption;         // 혈압 관련 옵션 (high, normal)
    private String skinType;         // 체형 타입 (thin, normal, overweight, obese)
    private String insulinOption;    // 인슐린 관련 옵션 (high, normal, unknown)
    private String dpfOption;        // 가족력 옵션 (parent, relative, none)
    
    // 일반인용 추가 입력 필드
    private Integer height;          // 키 (cm)
    private Integer weight;          // 몸무게 (kg)
}