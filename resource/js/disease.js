document.addEventListener('DOMContentLoaded', function() {
    const diseaseItems = document.querySelectorAll('.disease-item');
    const diseaseContent = document.getElementById('diseaseContent');
    const errorElement = document.querySelector('.error');
    
    // 백엔드 프록시 URL
    const BASE_URL = '/api/kdca?code=';
    
    // 질병 클릭 이벤트
    diseaseItems.forEach(item => {
        item.addEventListener('click', function() {
            // 활성화 표시
            document.querySelectorAll('.disease-item').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            // 데이터 로드
            const diseaseCode = this.getAttribute('data-code');
            const diseaseName = this.textContent;
            loadDiseaseData(diseaseCode, diseaseName);
            
            // 모바일 뷰에서 스크롤
            if (window.innerWidth <= 1024) {
                const diseaseContentElement = document.querySelector('.disease-content-container');
                diseaseContentElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 질병 데이터 로드
    function loadDiseaseData(code, name) {
        // 로딩 상태 표시
        diseaseContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>질병정보를 불러오는 중입니다...</p>
            </div>
        `;
        errorElement.style.display = 'none';
        
        // API 호출
        fetch(BASE_URL + code)
            .then(response => {
                if (!response.ok) {
                    throw new Error('API 요청 실패');
                }
                return response.text();
            })
            .then(xmlString => {
                // XML 파싱
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                
                // 데이터 표시
                displayDiseaseData(xmlDoc, name);
            })
            .catch(error => {
                console.error('Error:', error);
                errorElement.style.display = 'block';
                diseaseContent.innerHTML = '';
            });
    }
    
    // 질병 데이터 표시
    function displayDiseaseData(xmlDoc, name) {
        let html = `
            <div class="disease-header">
                <h1 class="disease-name">${name}</h1>
            </div>
        `;
        
        // XML에서 컨텐츠 추출
        const sections = xmlDoc.querySelectorAll('cntntsCl');
        
        sections.forEach(section => {
            const sectionTitle = section.querySelector('CNTNTS_CL_NM');
            const sectionContent = section.querySelector('CNTNTS_CL_CN');
            
            if (sectionTitle && sectionContent) {
                const title = sectionTitle.textContent.trim();
                const content = sectionContent.textContent
                    .replace(/<!\[CDATA\[|\]\]>/g, '')
                    .trim();
                
                // URL이 아닌 내용만 표시
                if (title && content && !content.includes('http')) {
                    html += `
                        <div class="section">
                            <h2 class="section-title">${title}</h2>
                            <div class="section-content">${formatContent(content)}</div>
                        </div>
                    `;
                }
            }
        });
        
        diseaseContent.innerHTML = html;
    }
    
    // 텍스트 포맷팅
    function formatContent(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/○/g, '• ');
    }
    
    // 초기 데이터 로드 (독감)
    loadDiseaseData('5232', '독감(인플루엔자)');
    
    // 초기 활성화 상태 설정
    const initialDiseaseItem = document.querySelector('.disease-item[data-code="5232"]');
    if (initialDiseaseItem) {
        initialDiseaseItem.classList.add('active');
    }
});