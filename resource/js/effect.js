document.addEventListener('DOMContentLoaded', function() {
    // 변수 선언
    const efficacyButtons = document.querySelectorAll('.efficacy-btn');
    const resultsContainer = document.getElementById('results');
    const loadingIndicator = document.getElementById('loading');
    const selectedEfficacyTitle = document.getElementById('selected-efficacy');
    const paginationContainer = document.getElementById('pagination');
    const thesisContainer = document.getElementById('thesis-container');
    const thesisResults = document.getElementById('thesis-results');
    const selectedFoodTitle = document.getElementById('selected-food-title');
    
    // API 키 설정 - 인코딩된 키
    const apiKey = "f82yPXMXNwVt+s0bhbI6wzLIZDCJ/E5qXCVZc6YCiU2r/9c9mT8aX5v6E9wTaNqWIRKusEqdAmc2KOp23FetzA==";
    const baseUrl = "https://apis.data.go.kr/1390802/AgriFood/FncltyEfcy2/getThesisInfoOnFoodByFnclty2";
    
    // 현재 페이지와 페이지 사이즈
    let currentPage = 1;
    const pageSize = 20;
    let currentEfficacyCode = '';
    let currentEfficacyName = '';
    let totalItems = 0;
    let foodSamples = []; // 식품 데이터 캐시
    
    // 모든 효능 버튼에 이벤트 리스너 등록
    efficacyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성화 된 버튼 스타일 초기화 및 설정
            efficacyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 선택된 효능 정보 저장
            currentEfficacyCode = this.dataset.code;
            currentEfficacyName = this.textContent;
            currentPage = 1;
            
            // 선택된 효능 표시
            selectedEfficacyTitle.innerHTML = `<span class="selected-info-icon">💡</span> 선택된 효능: ${currentEfficacyName} (${currentEfficacyCode})`;
            
            // 논문 정보 숨기기
            thesisContainer.style.display = 'none';
            
            // 데이터 가져오기
            fetchFoodData(currentEfficacyCode, currentPage);
        });
    });
    
    // 공공 API에서 데이터 가져오기
    function fetchFoodData(efficacyCode, page) {
        // 로딩 표시
        loadingIndicator.style.display = 'block';
        resultsContainer.innerHTML = '';
        paginationContainer.innerHTML = '';
        
        // API 요청 파라미터
        const params = {
            serviceKey: apiKey,
            fnclty_Cd: efficacyCode,
            research_Type_Cd: "G005",
            Page_No: page,
            Page_Size: pageSize
        };
        
        // 파라미터를 URL 쿼리스트링으로 변환
        const queryString = Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');
        
        // AJAX 요청
        const xhr = new XMLHttpRequest();
        xhr.open('GET', baseUrl + '?' + queryString, true);
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const xmlDoc = xhr.responseXML;
                
                // 총 아이템 수 추출
                const totalCountElement = xmlDoc.querySelector("total_Count");
                totalItems = totalCountElement ? parseInt(totalCountElement.textContent) : 0;
                
                // 전체 샘플 데이터 저장
                foodSamples = [];
                
                // 샘플 데이터 추출
                const sampleItems = xmlDoc.querySelectorAll("sample_List > item");
                
                sampleItems.forEach(item => {
                    const sampleId = item.querySelector("sample_Id") ? item.querySelector("sample_Id").textContent : '';
                    const sampleName = item.querySelector("sample_Nm") ? item.querySelector("sample_Nm").textContent : '';
                    
                    // 논문 데이터 추출
                    const theses = [];
                    const thesisItems = item.querySelectorAll("thesis_List > item");
                    
                    thesisItems.forEach(thesis => {
                        theses.push({
                            title: thesis.querySelector("title") ? thesis.querySelector("title").textContent : '',
                            details: thesis.querySelector("details") ? thesis.querySelector("details").textContent : '',
                            year: thesis.querySelector("pblicte_Year") ? thesis.querySelector("pblicte_Year").textContent : ''
                        });
                    });
                    
                    // 샘플 데이터 저장
                    foodSamples.push({
                        id: sampleId,
                        name: sampleName,
                        theses: theses
                    });
                });
                
                // 결과가 없는 경우
                if (foodSamples.length === 0) {
                    resultsContainer.innerHTML = '<div class="error-message">해당 효능에 대한 식품 정보가 없습니다.</div>';
                    loadingIndicator.style.display = 'none';
                    return;
                }
                
                // 결과 표시
                displayResults(foodSamples);
                
                // 페이지네이션 생성
                createPagination(totalItems, pageSize, currentPage);
            } else {
                console.error("API 호출 중 오류 발생:", xhr.statusText);
                resultsContainer.innerHTML = `<div class="error-message">데이터를 불러오는 중 오류가 발생했습니다: ${xhr.statusText}</div>`;
            }
            
            // 로딩 표시 숨기기
            loadingIndicator.style.display = 'none';
        };
        
        xhr.onerror = function() {
            console.error("API 호출 중 네트워크 오류 발생");
            resultsContainer.innerHTML = '<div class="error-message">네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.</div>';
            loadingIndicator.style.display = 'none';
        };
        
        xhr.send();
    }
    
    // 식품 결과 표시 함수
    function displayResults(samples) {
        resultsContainer.innerHTML = '';
        
        samples.forEach(function(sample, index) {
            // 식품 카드 생성
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.textContent = sample.name;
            foodItem.setAttribute('data-index', index);
            foodItem.addEventListener('click', function() {
                // 클릭된 식품 강조
                document.querySelectorAll('.food-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
                
                // 논문 정보 표시
                showThesisInfo(sample);
            });
            
            resultsContainer.appendChild(foodItem);
        });
    }
    
    // 논문 정보 표시 함수
    function showThesisInfo(sample) {
        selectedFoodTitle.textContent = `${sample.name}에 관한 논문 정보`;
        thesisResults.innerHTML = '';
        
        if (sample.theses.length === 0) {
            thesisResults.innerHTML = '<div class="error-message">해당 식품에 대한 논문 정보가 없습니다.</div>';
            thesisContainer.style.display = 'block';
            return;
        }
        
        sample.theses.forEach(function(thesis) {
            const thesisItem = document.createElement('div');
            thesisItem.className = 'thesis-item';
            
            const titleElement = document.createElement('div');
            titleElement.className = 'thesis-title';
            titleElement.textContent = thesis.title;
            
            const yearElement = document.createElement('div');
            yearElement.className = 'thesis-year';
            yearElement.textContent = `발표 연도: ${thesis.year}`;
            
            const detailsElement = document.createElement('div');
            detailsElement.className = 'thesis-details';
            detailsElement.textContent = thesis.details;
            
            thesisItem.appendChild(titleElement);
            thesisItem.appendChild(yearElement);
            thesisItem.appendChild(detailsElement);
            
            thesisResults.appendChild(thesisItem);
        });
        
        thesisContainer.style.display = 'block';
    }
    
    // 페이지네이션 생성 함수
    function createPagination(totalItems, pageSize, currentPage) {
        const totalPages = Math.ceil(totalItems / pageSize);
        
        if (totalPages <= 1) {
            return;
        }
        
        paginationContainer.innerHTML = '';
        
        // 처음으로 버튼
        if (currentPage > 1) {
            addPaginationButton('처음', 1);
        }
        
        // 이전 버튼
        if (currentPage > 1) {
            addPaginationButton('이전', currentPage - 1);
        }
        
        // 페이지 번호 버튼
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            addPaginationButton(i.toString(), i, i === currentPage);
        }
        
        // 다음 버튼
        if (currentPage < totalPages) {
            addPaginationButton('다음', currentPage + 1);
        }
        
        // 마지막으로 버튼
        if (currentPage < totalPages) {
            addPaginationButton('마지막', totalPages);
        }
    }
    
    // 페이지네이션 버튼 추가 함수
    function addPaginationButton(text, page, isActive = false) {
        const button = document.createElement('button');
        button.textContent = text;
        
        if (isActive) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', function() {
            currentPage = page;
            fetchFoodData(currentEfficacyCode, currentPage);
        });
        
        paginationContainer.appendChild(button);
    }
    
    // 직접 테스트를 위해 위건강(H022) 버튼 자동 클릭
    const defaultButton = document.querySelector('.efficacy-btn[data-code="H022"]');
    if (defaultButton) {
        defaultButton.click();
    }
});