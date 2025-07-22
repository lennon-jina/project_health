document.addEventListener('DOMContentLoaded', function() {
    // 모드 전환 버튼 기능
    const expertMode = document.getElementById('expert-mode');
    const normalMode = document.getElementById('normal-mode');
    const expertForm = document.getElementById('expert-form');
    const normalForm = document.getElementById('normal-form');
    const modeField = document.getElementById('mode');
    
    expertMode.addEventListener('click', function() {
        expertMode.classList.add('active');
        normalMode.classList.remove('active');
        expertForm.style.display = 'block';
        normalForm.style.display = 'none';
        
        // 모드 설정
        modeField.value = 'expert';
        
        // 폼 필드 활성화/비활성화 처리
        toggleModeFields();
    
    // 일반인용 폼의 인터랙션 처리
    // 포도당 관련
    const glucoseOptions = document.querySelectorAll('input[name="glucose-option"]');
    const glucoseOptionHidden = document.getElementById('glucoseOption');
    const glucoseValue = document.getElementById('glucose-value');
    
    glucoseOptions.forEach(option => {
        option.addEventListener('change', function() {
            // hidden 필드 업데이트
            glucoseOptionHidden.value = this.value;
            
            if (this.value === 'high') {
                glucoseValue.value = '140';
            } else if (this.value === 'normal') {
                glucoseValue.value = '85';
            } else {
                glucoseValue.value = '100';
            }
        });
    });
    
    // 혈압 관련
    const bpOptions = document.querySelectorAll('input[name="bp-option"]');
    const bpOptionHidden = document.getElementById('bpOption');
    const bpValue = document.getElementById('bloodPressure-value');
    
    bpOptions.forEach(option => {
        option.addEventListener('change', function() {
            // hidden 필드 업데이트
            bpOptionHidden.value = this.value;
            
            if (this.value === 'high') {
                bpValue.value = '140';
            } else {
                bpValue.value = '80';
            }
        });
    });
    
    // 피부 두께(체형) 선택
    const skinSelect = document.getElementById('skin-select');
    const skinTypeHidden = document.getElementById('skinType');
    const skinValue = document.getElementById('skinThickness-value');
    
    skinSelect.addEventListener('change', function() {
        // hidden 필드 업데이트
        skinTypeHidden.value = this.value;
        
        // 체형에 따른 피부 두께 값 설정
        if (this.value === 'thin') {
            skinValue.value = '10';
        } else if (this.value === 'normal') {
            skinValue.value = '20';
        } else if (this.value === 'overweight') {
            skinValue.value = '30';
        } else if (this.value === 'obese') {
            skinValue.value = '40';
        }
    });
    
    // 인슐린 관련
    const insulinOptions = document.querySelectorAll('input[name="insulin-option"]');
    const insulinOptionHidden = document.getElementById('insulinOption');
    const insulinValue = document.getElementById('insulin-value');
    
    insulinOptions.forEach(option => {
        option.addEventListener('change', function() {
            // hidden 필드 업데이트
            insulinOptionHidden.value = this.value;
            
            if (this.value === 'high') {
                insulinValue.value = '100';
            } else if (this.value === 'normal') {
                insulinValue.value = '30';
            } else {
                insulinValue.value = '50';
            }
        });
    });
    
    // BMI 계산기
    const heightInput = document.getElementById('height-input');
    const weightInput = document.getElementById('weight-input');
    const bmiResult = document.getElementById('bmi-result');
    const heightHidden = document.getElementById('height-field');
    const weightHidden = document.getElementById('weight-field');
    
    function calculateBMI() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        
        if (height && weight) {
            // hidden 필드 업데이트
            heightHidden.value = height;
            weightHidden.value = weight;
            
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            bmiResult.value = bmi.toFixed(2);
            
            // BMI 설명 추가
            let bmiCategory = "";
            if (bmi < 18.5) {
                bmiCategory = "저체중";
            } else if (bmi < 25) {
                bmiCategory = "정상";
            } else if (bmi < 30) {
                bmiCategory = "과체중";
            } else {
                bmiCategory = "비만";
            }
            
            // BMI 설명 업데이트
            const bmiDesc = document.querySelector('.bmi-description span');
            if (bmiDesc) {
                bmiDesc.textContent = `저체중: 18.5 미만 | 정상: 18.5-24.9 | 과체중: 25-29.9 | 비만: 30 이상 (현재: ${bmiCategory})`;
            }
        }
    }
    
    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
    
    // 가족력 라디오 버튼
    const dpfOptions = document.querySelectorAll('input[name="dpf-option"]');
    const dpfOptionHidden = document.getElementById('dpfOption');
    const dpfValue = document.getElementById('diabetesPedigreeFunction-value');
    
    dpfOptions.forEach(option => {
        option.addEventListener('change', function() {
            // hidden 필드 업데이트
            dpfOptionHidden.value = this.value;
            
            if (this.value === 'parent') {
                dpfValue.value = '0.5';
            } else if (this.value === 'relative') {
                dpfValue.value = '0.3';
            } else {
                dpfValue.value = '0.1';
            }
        });
    });

    // 폼 제출 처리
    document.getElementById('diabetes-form').addEventListener('submit', function(e) {
        // 현재 모드 확인
        const currentMode = document.getElementById('mode').value;
        
        if (currentMode === 'normal') {
            // 나이 값이 입력되었는지 확인
            const ageValue = document.getElementById('age-normal').value;
            if (!ageValue || ageValue <= 0) {
                alert('나이를 올바르게 입력해주세요.');
                e.preventDefault();
                return;
            }
            
            // BMI가 입력되지 않은 경우 기본값 설정
            if (!document.getElementById('bmi-result').value) {
                document.getElementById('bmi-result').value = '25.0';
            }
        } else {
            // 전문가용 모드에서 필수 입력값 검증
            const requiredFields = [
                { id: 'glucose-expert', name: '포도당 농도' },
                { id: 'bloodPressure-expert', name: '혈압' },
                { id: 'skinThickness-expert', name: '피부 두께' },
                { id: 'insulin-expert', name: '인슐린' },
                { id: 'bmi-expert', name: '체질량지수 (BMI)' },
                { id: 'diabetesPedigreeFunction-expert', name: '당뇨병 가족력 함수' },
                { id: 'age-expert', name: '나이' }
            ];
            
            for (const field of requiredFields) {
                const value = document.getElementById(field.id).value;
                if (!value || value <= 0) {
                    alert(`${field.name}를 올바르게 입력해주세요.`);
                    e.preventDefault();
                    return;
                }
            }
        }
    });
    
    // 폼 초기화 버튼 이벤트
    document.querySelector('.btn-reset').addEventListener('click', function() {
        // 히든 필드 초기화
        document.getElementById('glucoseOption').value = 'unknown';
        document.getElementById('bpOption').value = 'normal';
        document.getElementById('skinType').value = 'normal';
        document.getElementById('insulinOption').value = 'normal';
        document.getElementById('dpfOption').value = 'none';
        document.getElementById('height-field').value = '';
        document.getElementById('weight-field').value = '';
        
        // 라디오 버튼 초기화
        document.getElementById('glucose-unknown').checked = true;
        document.getElementById('bp-no').checked = true;
        document.getElementById('insulin-no').checked = true;
        document.getElementById('dpf-no').checked = true;
        
        // 드롭다운 초기화
        document.getElementById('skin-select').value = 'normal';
        
        // 입력 필드 초기화
        document.getElementById('height-input').value = '';
        document.getElementById('weight-input').value = '';
        document.getElementById('bmi-result').value = '';
        document.getElementById('age-normal').value = '';
        
        // 전문가용 폼 필드 초기화
        document.getElementById('pregnancies-expert').value = '';
        document.getElementById('glucose-expert').value = '';
        document.getElementById('bloodPressure-expert').value = '';
        document.getElementById('skinThickness-expert').value = '';
        document.getElementById('insulin-expert').value = '';
        document.getElementById('bmi-expert').value = '';
        document.getElementById('diabetesPedigreeFunction-expert').value = '';
        document.getElementById('age-expert').value = '';
    });
    
    // 초기화: 페이지 로드 시 활성 모드에 맞게 필드 상태 설정
    toggleModeFields();
    
    // 입력 필드에 애니메이션 효과 추가
    const formInputs = document.querySelectorAll('.form-input, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}););
    
    normalMode.addEventListener('click', function() {
        normalMode.classList.add('active');
        expertMode.classList.remove('active');
        normalForm.style.display = 'block';
        expertForm.style.display = 'none';
        
        // 모드 설정
        modeField.value = 'normal';
        
        // 폼 필드 활성화/비활성화 처리
        toggleModeFields();
    });
    
    // 활성화된 모드에 따라 필드를 활성화/비활성화
    function toggleModeFields() {
        const isExpertMode = modeField.value === 'expert';
        
        // 전문가용 모드일 때
        document.getElementById('pregnancies-expert').disabled = !isExpertMode;
        document.getElementById('glucose-expert').disabled = !isExpertMode;
        document.getElementById('bloodPressure-expert').disabled = !isExpertMode;
        document.getElementById('skinThickness-expert').disabled = !isExpertMode;
        document.getElementById('insulin-expert').disabled = !isExpertMode;
        document.getElementById('bmi-expert').disabled = !isExpertMode;
        document.getElementById('diabetesPedigreeFunction-expert').disabled = !isExpertMode;
        document.getElementById('age-expert').disabled = !isExpertMode;
        
        // 일반인용 모드일 때
        document.getElementById('glucose-yes').disabled = isExpertMode;
        document.getElementById('glucose-no').disabled = isExpertMode;
        document.getElementById('glucose-unknown').disabled = isExpertMode;
        document.getElementById('bp-yes').disabled = isExpertMode;
        document.getElementById('bp-no').disabled = isExpertMode;
        document.getElementById('skin-select').disabled = isExpertMode;
        document.getElementById('insulin-yes').disabled = isExpertMode;
        document.getElementById('insulin-no').disabled = isExpertMode;
        document.getElementById('insulin-unknown').disabled = isExpertMode;
        document.getElementById('height-input').disabled = isExpertMode;
        document.getElementById('weight-input').disabled = isExpertMode;
        document.getElementById('bmi-result').disabled = isExpertMode;
        document.getElementById('dpf-parent').disabled = isExpertMode;
        document.getElementById('dpf-relative').disabled = isExpertMode;
        document.getElementById('dpf-no').disabled = isExpertMode;
        document.getElementById('age-normal').disabled = isExpertMode;
    }