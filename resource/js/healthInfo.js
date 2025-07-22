document.addEventListener('DOMContentLoaded', function() {
    const infoItems = document.querySelectorAll('.info-item');
    const infoContent = document.getElementById('infoContent');
    const errorElement = document.querySelector('.error');
    
    // 백엔드 프록시 URL
    const BASE_URL = '/api/kdca?code=';
    
    // 정보 항목 클릭 이벤트
    infoItems.forEach(item => {
        item.addEventListener('click', function() {
            // 활성화 표시
            document.querySelectorAll('.info-item').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            // 데이터 로드
            const infoCode = this.getAttribute('data-code');
            const infoName = this.textContent;
            loadInfoData(infoCode, infoName);
            
            // 모바일 뷰에서 스크롤
            if (window.innerWidth <= 768) {
                const contentBox = document.querySelector('.content-box');
                contentBox.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // 건강 정보 데이터 로드
    function loadInfoData(code, name) {
        // 로딩 상태 표시
        infoContent.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>건강정보를 불러오는 중입니다...</p>
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
                displayInfoData(xmlDoc, name);
            })
            .catch(error => {
                console.error('Error:', error);
                errorElement.style.display = 'block';
                infoContent.innerHTML = '';
            });
    }
    
    // 건강 정보 데이터 표시
    function displayInfoData(xmlDoc, name) {
        let html = `
            <div class="info-header">
                <h1 class="info-name">${name}</h1>
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
        
        infoContent.innerHTML = html;
    }
    
    // 텍스트 포맷팅
    function formatContent(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/○/g, '• ');
    }
    
    // 초기 데이터 로드 (국가건강검진)
    loadInfoData('5295', '국가건강검진');
    
    // 초기 활성화 상태 설정
    const initialInfoItem = document.querySelector('.info-item[data-code="5295"]');
    if (initialInfoItem) {
        initialInfoItem.classList.add('active');
    }
});