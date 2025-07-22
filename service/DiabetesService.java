package com.health.my.service;
import com.health.my.dto.DiabetesDto;
import com.health.my.util.PythonConnector;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiabetesService {
    
    private final PythonConnector pythonConnector;
    
    /**
     * 당뇨병 위험도 예측
     */
    public DiabetesDto predictDiabetesRisk(DiabetesDto diabetesDto) {
        // DTO를 Map으로 변환 (파이썬 API 요청용)
        Map<String, Object> inputData = new HashMap<>();
        
        // 전문가용 모드: 기존 로직 유지
        if (diabetesDto.getMode() == null || diabetesDto.getMode().equals("expert")) {
            // null 값을 0으로 대체 (또는 적절한 기본값으로)
            inputData.put("Pregnancies", diabetesDto.getPregnancies() != null ? diabetesDto.getPregnancies() : 0);
            inputData.put("Glucose", diabetesDto.getGlucose() != null ? diabetesDto.getGlucose() : 0);
            inputData.put("BloodPressure", diabetesDto.getBloodPressure() != null ? diabetesDto.getBloodPressure() : 0);
            inputData.put("SkinThickness", diabetesDto.getSkinThickness() != null ? diabetesDto.getSkinThickness() : 0);
            inputData.put("Insulin", diabetesDto.getInsulin() != null ? diabetesDto.getInsulin() : 0);
            inputData.put("BMI", diabetesDto.getBmi() != null ? diabetesDto.getBmi() : 0.0f);
            inputData.put("DiabetesPedigreeFunction", diabetesDto.getDiabetesPedigreeFunction() != null ? diabetesDto.getDiabetesPedigreeFunction() : 0.0f);
            inputData.put("Age", diabetesDto.getAge() != null ? diabetesDto.getAge() : 0);
        } 
        // 일반인용 모드: 일반인용 입력 데이터 포함
        else if (diabetesDto.getMode().equals("normal")) {
            // 모드 정보 추가
            inputData.put("mode", "normal");
            
            // 기본 필수 데이터 설정
            inputData.put("Pregnancies", diabetesDto.getPregnancies() != null ? diabetesDto.getPregnancies() : 0);
            inputData.put("Glucose", diabetesDto.getGlucose() != null ? diabetesDto.getGlucose() : 100);
            inputData.put("BloodPressure", diabetesDto.getBloodPressure() != null ? diabetesDto.getBloodPressure() : 80);
            inputData.put("SkinThickness", diabetesDto.getSkinThickness() != null ? diabetesDto.getSkinThickness() : 20);
            inputData.put("Insulin", diabetesDto.getInsulin() != null ? diabetesDto.getInsulin() : 30);
            inputData.put("BMI", diabetesDto.getBmi() != null ? diabetesDto.getBmi() : 25.0f);
            inputData.put("DiabetesPedigreeFunction", diabetesDto.getDiabetesPedigreeFunction() != null ? diabetesDto.getDiabetesPedigreeFunction() : 0.1f);
            inputData.put("Age", diabetesDto.getAge() != null ? diabetesDto.getAge() : 0);
            
            // 일반인용 추가 정보 포함 (null 값 방지를 위한 기본값 설정)
            inputData.put("glucoseOption", diabetesDto.getGlucoseOption() != null ? diabetesDto.getGlucoseOption() : "unknown");
            inputData.put("bpOption", diabetesDto.getBpOption() != null ? diabetesDto.getBpOption() : "normal");
            inputData.put("skinType", diabetesDto.getSkinType() != null ? diabetesDto.getSkinType() : "normal");
            inputData.put("insulinOption", diabetesDto.getInsulinOption() != null ? diabetesDto.getInsulinOption() : "normal");
            inputData.put("dpfOption", diabetesDto.getDpfOption() != null ? diabetesDto.getDpfOption() : "none");
            
            // 키와 몸무게 정보도 추가 (있는 경우)
            if (diabetesDto.getHeight() != null) {
                inputData.put("height", diabetesDto.getHeight());
            }
            
            if (diabetesDto.getWeight() != null) {
                inputData.put("weight", diabetesDto.getWeight());
            }
        }
        
        System.out.println("파이썬 API로 전송할 데이터: " + inputData); // 디버그 로그 추가
        
        try {
            // 파이썬 API 호출
            Map<String, Object> result = pythonConnector.predictDiabetes(inputData);
            
            // 결과 출력 (디버깅)
            System.out.println("파이썬 API 응답 결과: " + result);
            
            // 결과 설정 (null 체크 추가)
            if (result.containsKey("probability")) {
                diabetesDto.setProbability((Double) result.get("probability"));
            } else {
                diabetesDto.setProbability(0.0); // 기본값 설정
            }
            
            if (result.containsKey("risk")) {
                diabetesDto.setRiskLevel((String) result.get("risk"));
            } else {
                diabetesDto.setRiskLevel("알 수 없음"); // 기본값 설정
            }
            
            return diabetesDto;
        } catch (Exception e) {
            e.printStackTrace(); // 상세한 오류 로그
            System.err.println("파이썬 API 호출 중 오류: " + e.getMessage());
            
            // 오류 발생 시 기본값 설정
            diabetesDto.setProbability(0.0);
            diabetesDto.setRiskLevel("계산 오류");
            return diabetesDto;
        }
    }
}