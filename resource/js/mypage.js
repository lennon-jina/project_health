document.addEventListener('DOMContentLoaded', function() {
    // 초기 애니메이션 설정
    initAnimations();
    
    // 탭 전환 이벤트 리스너 설정
    setupTabListeners();
    
    // 게시글 호버 효과 설정
    setupBoardItemEffects();
});

/**
 * 초기 애니메이션 설정
 */
function initAnimations() {
    // 페이지 제목 요소 애니메이션
    animatePageTitle();
    
    // 프로필 섹션 애니메이션
    animateProfileSection();
    
    // 물결 애니메이션
    animateWave();
    
    // 게시글 아이템 애니메이션
    animateBoardItems();
	
	// 탭 인디케이터 초기화 (이 줄 추가)
    initTabIndicator();
}

/**
 * 페이지 제목 애니메이션
 */
function animatePageTitle() {
    const titleArea = document.querySelector('.page-title');
    if (!titleArea) return;
    
    const titleSymbol = titleArea.querySelector('.title-symbol');
    const titleText = titleArea.querySelector('h2');
    const titleJp = titleArea.querySelector('.title-jp');
    
    // 아이콘 이미지 애니메이션
    if (titleSymbol) {
        gsap.from(titleSymbol, {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        });
    }
    
    // 제목 텍스트 애니메이션
    if (titleText) {
        gsap.from(titleText, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out'
        });
    }
    
    // 일본어 제목 애니메이션
    if (titleJp) {
        gsap.from(titleJp, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: 'power3.out'
        });
    }
}

/**
 * 프로필 섹션 애니메이션
 */
function animateProfileSection() {
    const profileSection = document.querySelector('.profile-section');
    if (!profileSection) return;
    
    // 프로필 섹션 전체 애니메이션
    gsap.from(profileSection, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.7,
        ease: 'power3.out'
    });
    
    // 프로필 이미지 애니메이션
    const profileImage = profileSection.querySelector('.profile-image-container');
    if (profileImage) {
        gsap.from(profileImage, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            delay: 1,
            ease: 'elastic.out(1, 0.5)'
        });
    }
    
    // 사용자 정보 애니메이션
    const userInfoRows = profileSection.querySelectorAll('.info-row');
    if (userInfoRows.length > 0) {
        gsap.from(userInfoRows, {
            x: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 1.2,
            ease: 'power3.out'
        });
    }
}

/**
 * 물결 애니메이션
 */
function animateWave() {
    const wave = document.querySelector('.wave');
    if (!wave) return;
    
    // 물결 좌우 움직임 애니메이션
    gsap.to(wave, {
        backgroundPosition: '-1200px 0',
        ease: 'linear',
        repeat: -1,
        duration: 20
    });
}

/**
 * 게시글 아이템 애니메이션
 */
function animateBoardItems() {
    const activeTab = document.querySelector('.tab-pane.active');
    if (!activeTab) return;
    
    const boardItems = activeTab.querySelectorAll('.board-item');
    if (boardItems.length === 0) return;
    
    gsap.from(boardItems, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power3.out'
    });
}

/**
 * 탭 전환 리스너 설정
 */
function setupTabListeners() {
    const tabButtons = document.querySelectorAll('.category-tab');
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            // 탭 버튼 애니메이션
            gsap.from(this, {
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // 0.3초 후에 게시글 아이템 애니메이션
            setTimeout(() => {
                const targetId = this.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);
                if (!targetPane) return;
                
                const boardItems = targetPane.querySelectorAll('.board-item');
                if (boardItems.length === 0) return;
                
                gsap.from(boardItems, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            }, 300);
        });
    });
}

/**
 * 게시글 아이템 호버 효과 설정
 */
function setupBoardItemEffects() {
    const boardItems = document.querySelectorAll('.board-item');
    if (boardItems.length === 0) return;
    
    boardItems.forEach(item => {
        // 마우스 진입 시 효과
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -5,
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // 카테고리 배지 효과
            const badge = this.querySelector('.category-badge');
            if (badge) {
                gsap.to(badge, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            // 바탕 원 효과
            const pseudo = this;
            gsap.to(pseudo, {
                '--circle-opacity': 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // 마우스 떠날 때 효과
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0,0,0,0.03)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // 카테고리 배지 효과 원복
            const badge = this.querySelector('.category-badge');
            if (badge) {
                gsap.to(badge, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            // 바탕 원 효과 원복
            const pseudo = this;
            gsap.to(pseudo, {
                '--circle-opacity': 0.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // 버튼 호버 효과
    setupButtonEffects();
}

/**
 * 버튼 호버 효과 설정
 */
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.sanrio-btn');
    if (buttons.length === 0) return;
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -3,
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * 탭 인디케이터 초기화
 */
function initTabIndicator() {
    const activeTab = document.querySelector('.category-tab.active');
    const indicator = document.querySelector('.tab-indicator');
    
    if (!activeTab || !indicator) return;
    
    const tabWidth = activeTab.offsetWidth;
    const tabLeft = activeTab.offsetLeft;
    
    indicator.style.width = `${tabWidth}px`;
    indicator.style.transform = `translateX(${tabLeft - 10}px)`;
}

/**
 * 탭 전환 이벤트 리스너 설정
 */
function setupTabListeners() {
    const tabs = document.querySelectorAll('.category-tab');
    const indicator = document.querySelector('.tab-indicator');
    
    if (tabs.length === 0 || !indicator) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 인디케이터 이동
            const tabWidth = this.offsetWidth;
            const tabLeft = this.offsetLeft;
            
            indicator.style.width = `${tabWidth}px`;
            indicator.style.transform = `translateX(${tabLeft - 10}px)`;
            
            // 탭 아이콘 애니메이션
            gsap.from(this.querySelector('.tab-icon'), {
                scale: 0.5, 
                opacity: 0.7,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
            
            // 탭 콘텐츠 애니메이션
            setTimeout(() => {
                const targetId = this.getAttribute('data-bs-target');
                const targetPane = document.querySelector(targetId);
                
                if (!targetPane) return;
                
                // 공백 상태 아이콘 애니메이션
                const emptyIcon = targetPane.querySelector('.empty-symbol');
                if (emptyIcon) {
                    gsap.from(emptyIcon, {
                        scale: 0.5,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'elastic.out(1, 0.5)'
                    });
                }
            }, 300);
        });
    });
}