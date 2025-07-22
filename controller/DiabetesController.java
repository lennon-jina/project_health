package com.health.my.controller;
import com.health.my.dto.DiabetesDto;
import com.health.my.service.DiabetesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/diabetes")
@RequiredArgsConstructor
public class DiabetesController {
    
    private final DiabetesService diabetesService;
    
    /**
     * 당뇨병 위험도 예측 페이지
     */
    @GetMapping("/predict")
    public String predictForm(Model model) {
        model.addAttribute("diabetesDto", new DiabetesDto());
        return "diabetes/predict";
    }
    
    /**
     * 당뇨병 위험도 예측 처리
     */
    @PostMapping("/predict")
    public String predictProcess(@ModelAttribute DiabetesDto diabetesDto, Model model) {
        try {
            // 입력 모드 확인
            String mode = diabetesDto.getMode();
            boolean isExpertMode = mode == null || mode.equals("expert");
            
            // 전문가 모드인 경우 모든 필드 필수
            if (isExpertMode) {
                // 입력값 유효성 검사
                if (diabetesDto.getPregnancies() == null || diabetesDto.getGlucose() == null || 
                    diabetesDto.getBloodPressure() == null || diabetesDto.getSkinThickness() == null ||
                    diabetesDto.getInsulin() == null || diabetesDto.getBmi() == null ||
                    diabetesDto.getDiabetesPedigreeFunction() == null || diabetesDto.getAge() == null) {
                    
                    model.addAttribute("errorMessage", "모든 필드를 입력해주세요.");
                    return "diabetes/predict";
                }
            } else {
                // 일반인 모드인 경우 기본값 설정 가능
                // 기본값이 설정되어 있으므로 대부분 유효성 검사가 필요하지 않음
                // 단, 필수 필드만 체크
                if (diabetesDto.getAge() == null) {
                    model.addAttribute("errorMessage", "나이를 입력해주세요.");
                    return "diabetes/predict";
                }
            }
            
            // 예측 실행
            DiabetesDto result = diabetesService.predictDiabetesRisk(diabetesDto);
            model.addAttribute("result", result);
            return "diabetes/result";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "예측 중 오류가 발생했습니다: " + e.getMessage());
            return "diabetes/predict";
        }
    }
}