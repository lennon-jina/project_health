// 카테고리별 음식 목록 조회 (검색어 필터링 수정)
function searchFoodsByCategory(categoryCode, categoryName, searchKeyword = '') {
    $('#loading').show();
    $('#result').hide();
    $('#categoryResult').hide();

    // API 요청 데이터 설정
    const requestData = { 
        categoryCode: categoryCode 
    };
    
    // 검색어가 있으면 요청 데이터에 추가
    if (searchKeyword && searchKeyword.trim() !== '') {
        requestData.foodName = searchKeyword;
    }

    // 카테고리 코드에 따른 음식 목록 조회 API
    $.ajax({
        url: '/api/food/category',
        method: 'GET',
        data: requestData,
        success: function(response) {
            $('#loading').hide();
            $('#categoryResult').show();
            
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response, "text/xml");
                
                // 결과 코드 확인
                const resultCode = xmlDoc.getElementsByTagName("result_Code")[0]?.textContent;
                if (resultCode !== "200") {
                    const resultMsg = xmlDoc.getElementsByTagName("result_Msg")[0]?.textContent || "음식 목록을 불러올 수 없습니다.";
                    $('#categoryResult').html(`<div class="error-message"><i class="fas fa-exclamation-circle me-2"></i>${resultMsg}</div>`);
                    return;
                }
                
                // 카테고리 정보 설정
                let titleText = `${categoryName} 음식 목록`;
                if (searchKeyword) {
                    titleText += ` (검색어: ${searchKeyword})`;
                }
                $('#categoryTitle').text(titleText);
                $('#categoryMeta').text(`카테고리 코드: ${categoryCode}`);
                
                // 음식 목록 찾기
                const items = xmlDoc.getElementsByTagName("items")[0];
                if (!items) {
                    $('#foodList').html('<div class="text-center text-muted py-3">해당 카테고리에 음식 정보가 없습니다.</div>');
                    return;
                }
                
                const itemElements = items.getElementsByTagName("item");
                if (!itemElements || itemElements.length === 0) {
                    $('#foodList').html('<div class="text-center text-muted py-3">해당 카테고리에 음식 정보가 없습니다.</div>');
                    return;
                }
                
                // 음식 목록 생성
                let foodListHtml = '';
                let itemCount = 0;
                
                for (let i = 0; i < itemElements.length; i++) {
                    const item = itemElements[i];
                    const foodCode = item.getElementsByTagName("food_Code")[0]?.textContent.trim();
                    const foodName = item.getElementsByTagName("food_Name")[0]?.textContent.trim();
                    
                    if (foodCode && foodName) {
                        itemCount++;
                        const foodIcon = getFoodIconByName(foodName);
                        
                        foodListHtml += `
                        <div class="food-card" data-code="${foodCode}" onclick="selectFood('${foodCode}', '${foodName}')">
                            <div class="food-card-icon">
                                <i class="fas ${foodIcon}"></i>
                            </div>
                            <div class="food-card-name">${foodName}</div>
                            <div class="food-card-code">코드: ${foodCode}</div>
                        </div>
                        `;
                    }
                }
                
                if (foodListHtml === '') {
                    if (searchKeyword) {
                        $('#foodList').html(`<div class="text-center text-muted py-3">"${searchKeyword}"와 관련된 ${categoryName} 음식 정보가 없습니다.</div>`);
                    } else {
                        $('#foodList').html('<div class="text-center text-muted py-3">해당 카테고리에 음식 정보가 없습니다.</div>');
                    }
                } else {
                    $('#foodList').html(foodListHtml);
                    
                    // 검색 결과 정보 표시
                    if (searchKeyword) {
                        $('#categoryMeta').text(`카테고리 코드: ${categoryCode} | 검색어: "${searchKeyword}" | ${itemCount}개 표시됨`);
                    }
                }
            } catch (e) {
                console.error('파싱 오류:', e);
                $('#categoryResult').html('<div class="error-message">응답 처리 중 오류가 발생했습니다.</div>');
            }
        },
        error: function(xhr, status, error) {
            $('#loading').hide();
            $('#categoryResult').show();
            $('#categoryResult').html(`<div class="error-message"><i class="fas fa-exclamation-circle me-2"></i>API 호출 중 오류가 발생했습니다: ${error}</div>`);
        }
    });
}// 영양성분 조회
function searchNutrition(foodCode, foodName) {
    // 두 번째 API 호출
    $.ajax({
        url: '/api/food/nutrition',
        method: 'GET',
        data: { foodCode: foodCode },
        success: function(response) {
            $('#loading').hide();
            $('#result').show();
            
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response, "text/xml");
                
                // 결과 코드 확인
                const resultCode = xmlDoc.getElementsByTagName("result_Code")[0]?.textContent;
                if (resultCode !== "200") {
                    const resultMsg = xmlDoc.getElementsByTagName("result_Msg")[0]?.textContent || "영양성분 정보를 불러올 수 없습니다.";
                    $('#nutritionInfo').html(`<div class="error-message"><i class="fas fa-exclamation-circle me-2"></i>${resultMsg}</div>`);
                    return;
                }
                
                // 영양성분 정보 찾기
                const items = xmlDoc.getElementsByTagName("items")[0];
                if (!items) {
                    $('#nutritionInfo').html('<div class="error-message">영양성분 정보를 찾을 수 없습니다.</div>');
                    return;
                }
                
                const item = items.getElementsByTagName("item")[0];
                if (!item) {
                    $('#nutritionInfo').html('<div class="error-message">영양성분 정보를 찾을 수 없습니다.</div>');
                    return;
                }
                
                const idntList = item.getElementsByTagName("idnt_List")[0];
                if (!idntList) {
                    $('#nutritionInfo').html('<div class="error-message">영양성분 상세 정보를 찾을 수 없습니다.</div>');
                    return;
                }

                // 영양성분 그룹화 (카테고리별로)
                const mainNutrients = [
                    { tag: 'energy_Qy', label: '열량', unit: 'kcal', category: '기본정보' },
                    { tag: 'food_Weight', label: '중량', unit: 'g', category: '기본정보' },
                    { tag: 'water_Qy', label: '수분', unit: 'g', category: '기본정보' }
                ];
                
                const macroNutrients = [
                    { tag: 'carbohydrate_Qy', label: '탄수화물', unit: 'g', category: '다량영양소' },
                    { tag: 'prot_Qy', label: '단백질', unit: 'g', category: '다량영양소' },
                    { tag: 'ntrfs_Qy', label: '지질', unit: 'g', category: '다량영양소' },
                    { tag: 'fibtg_Qy', label: '식이섬유', unit: 'g', category: '다량영양소' }
                ];
                
                const microNutrients = [
                    { tag: 'na_Qy', label: '나트륨', unit: 'mg', category: '미네랄' },
                    { tag: 'clci_Qy', label: '칼슘', unit: 'mg', category: '미네랄' },
                    { tag: 'irn_Qy', label: '철분', unit: 'mg', category: '미네랄' },
                    { tag: 'mg_Qy', label: '마그네슘', unit: 'mg', category: '미네랄' },
                    { tag: 'zn_Qy', label: '아연', unit: 'mg', category: '미네랄' },
                    { tag: 'ptss_Qy', label: '칼륨', unit: 'mg', category: '미네랄' }
                ];
                
                const vitamins = [
                    { tag: 'vtmn_C_Qy', label: '비타민C', unit: 'mg', category: '비타민' },
                    { tag: 'vtmn_B1_Qy', label: '비타민B1', unit: 'mg', category: '비타민' },
                    { tag: 'vtmn_B2_Qy', label: '비타민B2', unit: 'mg', category: '비타민' },
                    { tag: 'nacn_Qy', label: '나이아신', unit: 'mg', category: '비타민' },
                    { tag: 'catn_Qy', label: '카로틴', unit: 'μg', category: '비타민' },
                    { tag: 'fol_Qy', label: '엽산', unit: 'μg', category: '비타민' }
                ];
                
                const allNutrients = [...mainNutrients, ...macroNutrients, ...microNutrients, ...vitamins];
                
                // 카테고리별로 영양소 그룹화
                const categories = {
                    '기본정보': [],
                    '다량영양소': [],
                    '미네랄': [],
                    '비타민': []
                };
                
                allNutrients.forEach(nutrient => {
                    const value = idntList.getElementsByTagName(nutrient.tag)[0]?.textContent.trim();
                    if (value && value !== "0") {
                        categories[nutrient.category].push({
                            label: nutrient.label,
                            value: value,
                            unit: nutrient.unit
                        });
                    }
                });
                
                // HTML 생성
                let html = '';
                
                // 카테고리별로 출력
                Object.keys(categories).forEach(category => {
                    const nutrients = categories[category];
                    if (nutrients.length > 0) {
                        html += `<div class="nutrition-category">${category}</div>`;
                        nutrients.forEach(nutrient => {
                            html += `
                            <div class="nutrition-item">
                                <div class="nutrition-name">${nutrient.label}</div>
                                <div class="nutrition-value">${nutrient.value}<span class="nutrition-unit">${nutrient.unit}</span></div>
                            </div>
                            `;
                        });
                    }
                });
                
                if (html === '') {
                    html = '<div class="text-center text-muted py-3">영양성분 정보가 없습니다.</div>';
                }
                
                $('#nutritionInfo').html(html);
            } catch (e) {
                console.error('파싱 오류:', e);
                $('#nutritionInfo').html('<div class="error-message">응답 처리 중 오류가 발생했습니다.</div>');
            }
        },
        error: function(xhr, status, error) {
            $('#loading').hide();
            $('#result').show();
            $('#nutritionInfo').html(`<div class="error-message"><i class="fas fa-exclamation-circle me-2"></i>API 호출 중 오류가 발생했습니다: ${error}</div>`);
        }
    });
}$(document).ready(function() {
    // 검색한 음식 이름을 전역 변수로 저장
    let currentSearchedFood = '';
    
    // 검색 버튼 클릭 이벤트
    $('#searchBtn').on('click', function() {
        searchFood();
    });
    
    // 엔터키 입력시 검색
    $('#foodInput').on('keypress', function(e) {
        if (e.which === 13) {
            searchFood();
        }
    });

    // 카테고리 아이템 클릭 이벤트 - 동적으로 생성된 요소에 대한 이벤트 위임
    $(document).on('click', '.category-item', function() {
        const categoryCode = $(this).data('code');
        const categoryName = $(this).find('.category-name').text();
        
        // 선택된 카테고리 강조 표시
        $('.category-item').removeClass('active');
        $(this).addClass('active');
        
        // 카테고리 코드로 음식 목록 조회 (검색한 음식 이름을 함께 전달)
        searchFoodsByCategory(categoryCode, categoryName, currentSearchedFood);
    });

    // 관련 데이터 표시 버튼 클릭 이벤트
    $(document).on('click', '#showRelatedDataBtn', function() {
        const isChecked = $(this).prop('checked');
        
        // 카테고리가 선택되어 있으면 다시 검색
        const activeCategory = $('.category-item.active');
        if (activeCategory.length > 0) {
            const categoryCode = activeCategory.data('code');
            const categoryName = activeCategory.find('.category-name').text();
            
            // 체크박스 상태에 따라 검색어 전달 또는 미전달
            searchFoodsByCategory(categoryCode, categoryName, isChecked ? currentSearchedFood : '');
        }
    });
});

// 음식 이름으로 검색
function searchFood() {
    const foodName = $('#foodInput').val().trim();
    if (!foodName) {
        alert('음식 이름을 입력하세요.');
        return;
    }

    // 검색한 음식 이름 저장
    currentSearchedFood = foodName;
    
    $('#loading').show();
    $('#result').hide();
    $('#categoryResult').hide();
    $('#relatedCategories').hide();

    // 1. 음식 이름으로 food_Code 조회 (첫 번째 API)
    $.ajax({
        url: '/api/food/code',
        method: 'GET',
        data: { foodName: foodName },
        success: function(response) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response, "text/xml");
                
                // 결과 코드 확인
                const resultCode = xmlDoc.getElementsByTagName("result_Code")[0]?.textContent;
                if (resultCode !== "200") {
                    const resultMsg = xmlDoc.getElementsByTagName("result_Msg")[0]?.textContent || "검색 결과가 없습니다.";
                    $('#loading').hide();
                    $('#result').show();
                    $('#result').html(`<div class="error-message"><i class="fas fa-exclamation-circle me-2"></i>${resultMsg}</div>`);
                    return;
                }
                
                // 첫 번째 항목 찾기
                const items = xmlDoc.getElementsByTagName("items")[0];
                if (!items) {
                    showError("검색 결과가 없습니다.");
                    return;
                }
                
                const itemElements = items.getElementsByTagName("item");
                if (!itemElements || itemElements.length === 0) {
                    showError("검색 결과가 없습니다.");
                    return;
                }
                
                // 첫 번째 항목의 food_Code와 food_Name 추출
                const firstItem = itemElements[0];
                const foodCode = firstItem.getElementsByTagName("food_Code")[0]?.textContent.trim();
                const foodNameResult = firstItem.getElementsByTagName("food_Name")[0]?.textContent.trim();
                const largeName = firstItem.getElementsByTagName("large_Name")[0]?.textContent.trim() || "";
                const middleName = firstItem.getElementsByTagName("middle_Name")[0]?.textContent.trim() || "";
                const largeCode = firstItem.getElementsByTagName("large_Code")[0]?.textContent.trim() || "";
                
                if (!foodCode) {
                    showError("음식 코드를 찾을 수 없습니다.");
                    return;
                }
                
                // 음식 정보 표시
                $('#foodName').text(foodNameResult);
                $('#foodMeta').text(`${largeName} > ${middleName}`);
                
                // 적절한 음식 아이콘 설정
                setFoodIcon(foodNameResult);
                
                // 2. foodCode로 영양성분 조회 (두 번째 API)
                searchNutrition(foodCode, foodNameResult);
                
                // 관련 카테고리 표시
                showRelatedCategories(largeCode);
            } catch (e) {
                console.error('파싱 오류:', e);
                showError("응답 처리 중 오류가 발생했습니다.");
            }
        },
        error: function(xhr, status, error) {
            showError("API 호출 중 오류가 발생했습니다: " + error);
        }
    });
}

// 관련 카테고리 표시
function showRelatedCategories(defaultCode) {
    // 카테고리 데이터
    const categories = [
        { code: "01", name: "밥류", icon: "fa-bread-slice" },
        { code: "02", name: "과자 및 빵류", icon: "fa-cookie" },
        { code: "03", name: "면 및 만두류", icon: "fa-cookie-bite" },
        { code: "04", name: "죽류", icon: "fa-egg" },
        { code: "05", name: "국(탕)류", icon: "fa-drumstick-bite" },
        { code: "06", name: "찌개류", icon: "fa-fish" },
        { code: "07", name: "찜류", icon: "fa-pepper-hot" },
        { code: "08", name: "구이류", icon: "fa-bacon" },
        { code: "09", name: "전류", icon: "fa-seedling" },
        { code: "10", name: "볶음류", icon: "fa-carrot" },
        { code: "11", name: "조림류", icon: "fa-chess-rook" },
        { code: "12", name: "튀김류", icon: "fa-utensil-spoon" },
        { code: "28", name: "원재료", icon: "fa-seedling" },
        { code: "16", name: "젓갈류", icon: "fa-leaf" },
        { code: "19", name: "유유 및 유제품류", icon: "fa-wine-bottle" },
        { code: "21", name: "과일 및 과일가공품", icon: "fa-apple-alt" }
    ];
    
    // 카테고리 옵션 HTML 생성
    let categoryHtml = `
    <div class="related-options">
        <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="showRelatedDataBtn" checked>
            <label class="form-check-label" for="showRelatedDataBtn">
            </label>
        </div>
    </div>
    <div class="category-grid">
    `;
    
    categories.forEach(category => {
        const isHighlight = category.code === "28"; // 원재료는 기본적으로 강조 표시
        const isDefault = category.code === defaultCode; // 검색 결과의 카테고리 코드와 일치하면 활성화
        
        categoryHtml += `
        <div class="category-item ${isHighlight ? 'highlight' : ''} ${isDefault ? 'active' : ''}" data-code="${category.code}">
            <div class="category-icon"><i class="fas ${category.icon}"></i></div>
            <div class="category-name">${category.name}</div>
        </div>
        `;
    });
    
    categoryHtml += `</div>`;
    
    // 카테고리 옵션 추가 및 표시
    $('#categoryOptions').html(categoryHtml);
    $('#relatedCategories').show();
}

// 음식 카드 선택 시 영양성분 정보 조회
function selectFood(foodCode, foodName) {
    // 입력 필드에 선택된 음식 이름 설정
    $('#foodInput').val(foodName);
    
    // 검색한 음식 이름 업데이트
    currentSearchedFood = foodName;
    
    // 선택된 음식의 영양성분 조회
    $('#loading').show();
    $('#result').hide();
    $('#categoryResult').hide();
    $('#relatedCategories').hide();
    
    // 음식 정보 표시
    $('#foodName').text(foodName);
    
    // 적절한 음식 아이콘 설정
    setFoodIcon(foodName);
    
    // 영양성분 조회 API 호출
    searchNutrition(foodCode, foodName);
}

// 오류 메시지 표시
function showError(message) {
    $('#loading').hide();
    $('#result').show();
    $('#result').html(`<div class="error-message"><i class="fas fa-exclamation-circle me-2"></i>${message}</div>`);
}

// 음식 이름에 따라 적절한 아이콘 설정
function setFoodIcon(foodName) {
    // 음식 이름에 따라 적절한 아이콘 설정
    let iconClass = 'fa-carrot'; // 기본 아이콘
    
    if (foodName.includes('밥') || foodName.includes('쌀')) {
        iconClass = 'fa-bowl-rice';
    } else if (foodName.includes('고기') || foodName.includes('돼지') || foodName.includes('소고기') || foodName.includes('닭')) {
        iconClass = 'fa-drumstick-bite';
    } else if (foodName.includes('물고기') || foodName.includes('생선') || foodName.includes('회')) {
        iconClass = 'fa-fish';
    } else if (foodName.includes('빵') || foodName.includes('케이크')) {
        iconClass = 'fa-bread-slice';
    } else if (foodName.includes('과일') || foodName.includes('사과') || foodName.includes('바나나')) {
        iconClass = 'fa-apple-alt';
    } else if (foodName.includes('우유') || foodName.includes('요구르트') || foodName.includes('치즈')) {
        iconClass = 'fa-cheese';
    } else if (foodName.includes('차') || foodName.includes('커피') || foodName.includes('주스')) {
        iconClass = 'fa-mug-hot';
    } else if (foodName.includes('술') || foodName.includes('맥주') || foodName.includes('와인')) {
        iconClass = 'fa-wine-glass';
    }
    
    $('.food-icon i').attr('class', 'fas ' + iconClass);
    return iconClass;
}

// 음식 이름으로 아이콘 클래스 반환
function getFoodIconByName(foodName) {
    // 음식 이름에 따라 적절한 아이콘 클래스 반환
    if (foodName.includes('밥') || foodName.includes('쌀')) {
        return 'fa-bowl-rice';
    } else if (foodName.includes('고기') || foodName.includes('돼지') || foodName.includes('소고기') || foodName.includes('닭')) {
        return 'fa-drumstick-bite';
    } else if (foodName.includes('물고기') || foodName.includes('생선') || foodName.includes('회')) {
        return 'fa-fish';
    } else if (foodName.includes('빵') || foodName.includes('케이크')) {
        return 'fa-bread-slice';
    } else if (foodName.includes('과일') || foodName.includes('사과') || foodName.includes('바나나')) {
        return 'fa-apple-alt';
    } else if (foodName.includes('우유') || foodName.includes('요구르트') || foodName.includes('치즈')) {
        return 'fa-cheese';
    } else if (foodName.includes('차') || foodName.includes('커피') || foodName.includes('주스')) {
        return 'fa-mug-hot';
    } else if (foodName.includes('술') || foodName.includes('맥주') || foodName.includes('와인')) {
        return 'fa-wine-glass';
    } else if (foodName.includes('채소') || foodName.includes('야채')) {
        return 'fa-carrot';
    } else if (foodName.includes('면') || foodName.includes('국수') || foodName.includes('라면')) {
        return 'fa-utensils';
    } else if (foodName.includes('김치')) {
        return 'fa-pepper-hot';
    } else if (foodName.includes('떡')) {
        return 'fa-cookie';
    }
    
    return 'fa-carrot'; // 기본 아이콘
}