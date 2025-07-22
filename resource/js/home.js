// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 배경 이미지와 하단 메뉴 연결
    const img = document.querySelector('.background-image');
    const backgroundContainer = document.querySelector('.background-container');
    
	backgroundContainer.style.opacity = 1;

    // 메뉴 관련 요소 선택
    const menuButton = document.querySelector('.menu-button');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const headerHam = document.querySelector('.header__ham');
    const hamInner = document.querySelector('.header__ham__inner');
    const body = document.body;

    // 메뉴 버튼 내부 요소 생성 및 추가
    // 햄버거 바 요소 생성
    const bar1 = document.createElement('span');
    bar1.className = 'bar bar--1';

    const bar2 = document.createElement('span');
    bar2.className = 'bar bar--2';

    const bar3 = document.createElement('span');
    bar3.className = 'bar bar--3';

    const textOpen = document.createElement('span');
    textOpen.className = 'text__open';

    const textClose = document.createElement('span');
    textClose.className = 'text__close';

    // 메뉴 버튼에 요소 추가
    if (menuButton) {
        menuButton.innerHTML = ''; // 기존 내용 비우기
        menuButton.appendChild(bar1);
        menuButton.appendChild(bar2);
        menuButton.appendChild(bar3);
        menuButton.appendChild(textOpen);
        menuButton.appendChild(textClose);
    }

    // 메뉴 상태
    let isMenuOpen = false;

    // 메뉴 닫기 함수
    const closeMenu = () => {
        gsap.timeline()
            .to(bar1, { rotate: 0, translateY: 0, duration: 0.2 })
            .to(bar3, { rotate: 0, translateY: 0, duration: 0.2 }, "<")
            .to(bar2, { opacity: 1, duration: 0.2 }, "<")
            .to(textClose, { autoAlpha: 0, duration: 0.2 }, "<")
            .to(textOpen, { autoAlpha: 1, duration: 0.2 })
            .to(headerHam, { autoAlpha: 0, duration: 0.3 }, "<")
            .to(hamInner, { translateX: "100%", duration: 0.45, delay: 0.2 }, "<")
            .set(headerHam, { visibility: 'hidden', delay: 0.4 });

        isMenuOpen = false;
    };

    // 메뉴 열기 함수
    const openMenu = () => {
        gsap.timeline()
            .set(headerHam, { visibility: 'visible' })
            .to(textOpen, { autoAlpha: 0, duration: 0.2 })
            .to(textClose, { autoAlpha: 1, duration: 0.2 }, "<")
            .to(bar1, { translateY: '0.5rem', duration: 0.2 })
            .to(bar2, { opacity: 0, duration: 0.2 }, "<")
            .to(bar3, { translateY: '-0.5rem', duration: 0.2 }, "<")
            .to(headerHam, { autoAlpha: 1, duration: 0.4 }, "<")
            .to(hamInner, { translateX: 0, duration: 0.45, delay: 0.2 }, "<")
            .to(bar1, { rotate: 45, duration: 0.25, delay: 0.2 })
            .to(bar3, { rotate: -45, duration: 0.25, delay: 0.2 }, "<");

        isMenuOpen = true;
    };

    // 메뉴 버튼 클릭 이벤트
    if(menuButton) {
        menuButton.addEventListener('click', () => {
            // 진행 중인 애니메이션 중지
            gsap.killTweensOf([bar1, bar2, bar3, headerHam, hamInner, textOpen, textClose]);

            isMenuOpen ? closeMenu() : openMenu();
        });
    }

    // 닫기 버튼 클릭 이벤트
    if(closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // 메뉴 외부 영역 클릭 시 메뉴 닫기
    if(headerHam) {
        headerHam.addEventListener('click', function(e) {
            // 클릭된 요소가 hamInner 내부가 아니면 메뉴 닫기
            if(!hamInner.contains(e.target) && e.target !== hamInner) {
                closeMenu();
            }
        });
    }



    // 메뉴 컨테이너 초기에 숨기기
    const menuContainer = document.querySelector('.menu-container');
    gsap.set(menuContainer, { opacity: 0 });
    
    // 소개글 요소
    const mainTitle = document.querySelector('.main-title');
    const slogan = document.querySelector('.slogan');
    const headline = document.querySelector('.headline');
    
    // 원래 텍스트 저장
    const sloganText = slogan.textContent;
    const headlineHTML = headline.innerHTML;
    
    // 슬로건 텍스트를 개별 span으로 쪼개기
    let sloganHTML = '';
    for (let i = 0; i < sloganText.length; i++) {
        const char = sloganText[i];
        sloganHTML += `<span class="char" style="display:inline-block; opacity:0; transform:translateY(50px);">${char}</span>`;
    }
    slogan.innerHTML = sloganHTML;
    
    // 헤드라인 텍스트 쪼개기 (br 태그 고려)
    const headlineParts = headlineHTML.split('<br>');
    let headlineNewHTML = '';
    
    for (let i = 0; i < headlineParts.length; i++) {
        const part = headlineParts[i];
        for (let j = 0; j < part.length; j++) {
            const char = part[j];
            headlineNewHTML += `<span class="char" style="display:inline-block; opacity:0; transform:translateY(50px);">${char}</span>`;
        }
        if (i < headlineParts.length - 1) {
            headlineNewHTML += '<br>';
        }
    }
    headline.innerHTML = headlineNewHTML;
    
    // 메인 타이틀을 화면 중앙으로 이동
    gsap.set(mainTitle, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        opacity: 1
    });
    
    // 모든 글자 선택
    const sloganChars = slogan.querySelectorAll('.char');
    const headlineChars = headline.querySelectorAll('.char');
    
    // 글자 무한 움직임 함수 - 자연스러운 두둥실 효과 (폭 조정)
    const animateCharsContinuously = () => {
        // 모든 글자의 애니메이션 중지 (초기화)
        gsap.killTweensOf([...sloganChars, ...headlineChars]);
        
        // 외곽선 효과 자연스럽게 나타나도록 설정
        const addTextShadowGradually = (char) => {
            // 처음에는 그림자 없음
            gsap.set(char, { clearProps: "textShadow" });
            
            // 그림자 점진적으로 나타나게 하기
            gsap.to(char, {
                onUpdate: function() {
                    const progress = this.progress(); // 0에서 1 사이 진행도
                    const intensity = progress * 0.7; // 최대 0.7 투명도 (너무 강하지 않게)
                    char.style.textShadow = `0 0 3px rgba(255,255,255,${intensity}), 0 0 5px rgba(255,255,255,${intensity * 0.6})`;
                },
                duration: 2.5,
                ease: "power1.inOut"
            });
        };
        
        // 슬로건 글자 각각에 두둥실 떠다니는 효과 추가 (폭만 조정)
        sloganChars.forEach((char) => {
            // 각 글자별로 약간 다른 시작점과, 움직임 패턴
            const randomOffset = Math.random() * 1.5;
            // 위아래 폭만 더 크게 조정 (6~9px)
            const randomAmplitude = 6 + Math.random() * 3;
            const randomDuration = 2.5 + Math.random() * 1.5; // 2.5~4초 사이의 지속 시간
            
            // 외곽선 효과 자연스럽게 추가
            addTextShadowGradually(char);
            
            // 부드러운 위아래 떠다니는 움직임 (폭 증가)
            gsap.to(char, {
                y: `-=${randomAmplitude}`,
                duration: randomDuration,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: randomOffset
            });
            
            // 미세한 좌우 흔들림 (원래대로 작게 유지)
            gsap.to(char, {
                x: `+=${1 + Math.random() * 1}`, // 1~2px 범위 좌우 이동
                duration: 1.8 + Math.random() * 0.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: randomOffset * 0.7
            });
            
            // 아주 미세한 회전 (공기 중에 떠있는 듯한 느낌)
            gsap.to(char, {
                rotation: `+=${0.5 + Math.random() * 0.5}`, // 0.5~1도 사이의 미세한 회전
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: randomOffset * 1.2
            });
        });
        
        // 헤드라인 글자 각각에 두둥실 떠다니는 효과 추가 (폭만 조정)
        headlineChars.forEach((char) => {
            // 각 글자별로 약간 다른 시작점과, 움직임 패턴
            const randomOffset = Math.random() * 1.5;
            // 위아래 폭만 더 크게 조정 (4~7px)
            const randomAmplitude = 4 + Math.random() * 3;
            const randomDuration = 3 + Math.random() * 1.5; // 3~4.5초 사이의 지속 시간
            
            // 외곽선 효과 자연스럽게 추가
            addTextShadowGradually(char);
            
            // 부드러운 위아래 떠다니는 움직임 (폭 증가)
            gsap.to(char, {
                y: `-=${randomAmplitude}`,
                duration: randomDuration,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: randomOffset
            });
            
            // 미세한 좌우 흔들림 (원래대로 작게 유지)
            gsap.to(char, {
                x: `+=${0.8 + Math.random() * 0.8}`, // 0.8~1.6px 범위 좌우 이동
                duration: 2 + Math.random() * 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: randomOffset * 0.8
            });
            
            // 아주 미세한 회전 (공기 중에 떠있는 듯한 느낌)
            gsap.to(char, {
                rotation: `+=${0.3 + Math.random() * 0.4}`, // 0.3~0.7도 사이의 미세한 회전
                duration: 3.5 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: randomOffset * 1.3
            });
        });
    };
    
	// 애니메이션 대신 즉시 표시
	// 메인 타이틀 위치 재설정
	mainTitle.style.position = 'relative';
	mainTitle.style.left = '0';
	mainTitle.style.top = '0';
	mainTitle.style.transform = 'none';
	mainTitle.style.margin = '400px 0 0 50px';
	mainTitle.style.opacity = '1';

	// 모든 글자 즉시 표시
	sloganChars.forEach(function(char) {
	    char.style.opacity = 1;
	    char.style.transform = 'none';
	});

	headlineChars.forEach(function(char) {
	    char.style.opacity = 1;
	    char.style.transform = 'none';
	});

	// 메뉴 컨테이너 표시
	menuContainer.style.opacity = 1;
});

// about 섹션 시작

document.addEventListener('DOMContentLoaded', function() {
    // About 컨테이너 애니메이션
    gsap.from('.about-container', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });
    
    // 이미지 개별 애니메이션 추가
    gsap.to('.about-image img:nth-child(1)', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.8,
        ease: 'back.out(1.2)'
    });
    
    gsap.to('.about-image img:nth-child(2)', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 1.0,
        ease: 'back.out(1.2)'
    });
    
    gsap.to('.about-image img:nth-child(3)', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 1.2,
        ease: 'back.out(1.2)'
    });
    
    gsap.to('.about-image img:nth-child(4)', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 1.4,
        ease: 'back.out(1.2)'
    });
    
    // 발바닥 그림자 애니메이션 및 발바닥 애니메이션
    const animationDelay = 100; // 각 발바닥 사이의 지연 시간 (밀리초)
    const baseDelay = 500; // 초기 지연 시간
    
    for (let i = 1; i <= 20; i++) {
        const delay = baseDelay + (i - 1) * animationDelay;
        
        // 발바닥 그림자 애니메이션
        setTimeout(function() {
            gsap.to(`.footprint-shadow-${i}`, {
                opacity: 0.5,
                duration: 0.2,
            });
        }, delay - 50);
        
        // 발바닥 애니메이션
        setTimeout(function() {
            gsap.to(`.footprint-${i}`, {
                opacity: 1,
                duration: 0.1,
            });
            
            // 발바닥이 나타난 후 그림자 살짝 페이드아웃
            setTimeout(function() {
                gsap.to(`.footprint-shadow-${i}`, {
                    opacity: 0.3,
                    duration: 0.3,
                });
            }, 200);
        }, delay);
    }
    
    // 지구 이미지 애니메이션
    gsap.from('.earth-mascot', {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 1.5,
        ease: 'back.out(1.7)'
    });
    
    // 지구 메시지 애니메이션
    gsap.from('.earth-message', {
        y: -10,
        opacity: 0,
        duration: 0.8,
        delay: 2,
        ease: 'power2.out'
    });
    
    // 비행기 애니메이션
    gsap.from('.paper-plane-1', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 2.5,
        ease: 'power1.out'
    });
    
    gsap.from('.paper-plane-2', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        delay: 2.7,
        ease: 'power1.out'
    });
    
    gsap.from('.paper-plane-3', {
        y: 40,
        opacity: 0,
        duration: 1.3,
        delay: 2.9,
        ease: 'power1.out'
    });
    
    gsap.from('.paper-plane-4', {
        y: 35,
        opacity: 0,
        duration: 1.4,
        delay: 3.1,
        ease: 'power1.out'
    });
    
    gsap.from('.paper-plane-5', {
        y: 45,
        opacity: 0,
        duration: 1.3,
        delay: 3.3,
        ease: 'power1.out'
    });
    
    gsap.from('.paper-plane-6', {
        y: 55,
        opacity: 0,
        duration: 1.5,
        delay: 3.5,
        ease: 'power1.out'
    });
    
    // 비행기 지속적인 움직임
    gsap.to('.paper-plane-1', {
        y: '-=10',
        x: '+=5',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
    
    gsap.to('.paper-plane-2', {
        y: '-=8',
        x: '-=3',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.3
    });
    
    gsap.to('.paper-plane-3', {
        y: '-=12',
        x: '+=4',
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.6
    });
    
    gsap.to('.paper-plane-4', {
        y: '-=7',
        x: '-=2',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.9
    });
    
    gsap.to('.paper-plane-5', {
        y: '-=9',
        x: '+=3',
        duration: 1.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2
    });
    
    gsap.to('.paper-plane-6', {
        y: '-=11',
        x: '-=4',
        duration: 2.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5
    });
    
    // 카드 내부 비행기 애니메이션
    gsap.from('.card-plane', {
        x: -10,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        delay: 4,
        ease: 'power1.out'
    });
    
    gsap.to('.card-plane', {
        x: '+=5',
        y: '-=3',
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3
    });
    
    // 모든 발바닥 애니메이션이 끝난 후 Topics 섹션 애니메이션 시작
    const lastFootprintDelay = baseDelay + 19 * animationDelay + 500;
    
    gsap.from('.topics-left', {
        x: -20,
        opacity: 0,
        duration: 0.8,
        delay: lastFootprintDelay / 1000,
        ease: 'power2.out'
    });
    
    gsap.from('.topic-card', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        delay: (lastFootprintDelay + 300) / 1000,
        ease: 'power2.out'
    });
    
    // 캐릭터와 나무 애니메이션
    gsap.from('.character', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: (lastFootprintDelay + 600) / 1000,
        ease: 'back.out(1.7)'
    });
    
    gsap.from('.tree', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        delay: (lastFootprintDelay + 800) / 1000,
        ease: 'power2.out'
    });

    // 차트 초기화 함수 추가
    setTimeout(function() {
        initCharts();
    }, 1000);

    initFeatureSlider();

});

// 기존 JavaScript 코드 아래에 추가

// 범죄 예방 섹션 애니메이션
gsap.from('.crime-prevention-section', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 4.5, // 이전 애니메이션 후 시작
    ease: 'power2.out'
});

// 점 연결선 애니메이션
gsap.from('.dot-line', {
    y: -20,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    delay: 4.7,
    ease: 'power2.out'
});

// Pick Up 라벨 애니메이션
gsap.from('.pick-up-label', {
    x: -20,
    opacity: 0,
    duration: 0.8,
    delay: 4.9,
    ease: 'power2.out'
});

// 제목 애니메이션
gsap.from('.crime-title', {
    x: -20,
    opacity: 0,
    duration: 0.8,
    delay: 5.1,
    ease: 'power2.out'
});

// 카드 애니메이션
gsap.from('.crime-card', {
    y: 20,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    delay: 5.3,
    ease: 'back.out(1.2)'
});

// 아이콘 애니메이션
gsap.from('.card-icon', {
    scale: 0.8,
    opacity: 0,
    stagger: 0.2,
    duration: 0.5,
    delay: 5.6,
    ease: 'back.out(1.7)'
});

// 기존 JavaScript 코드 아래에 추가

// 안전 컨테이너 애니메이션
gsap.from('.safety-container', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
});

// 타이틀 애니메이션
gsap.from('.safety-title-en, .safety-title-jp', {
    x: -20,
    opacity: 0,
    stagger: 0.2,
    duration: 0.7,
    delay: 0.3,
    ease: 'power2.out'
});

// 텍스트 애니메이션
gsap.from('.safety-text p', {
    y: 10,
    opacity: 0,
    stagger: 0.2,
    duration: 0.7,
    delay: 0.5,
    ease: 'power2.out'
});

// 버튼 애니메이션
gsap.from('.safety-button', {
    y: 10,
    opacity: 0,
    duration: 0.7,
    delay: 0.9,
    ease: 'back.out(1.4)'
});

// 이미지 애니메이션
gsap.from('.safety-image img', {
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    delay: 0.7,
    ease: 'back.out(1.7)'
});

// 갤러리 아이템 애니메이션
gsap.from('.gallery-item', {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    delay: 1.1,
    ease: 'power2.out'
});

// 연결 라인 애니메이션
gsap.from('.connection-line', {
    height: 0,
    duration: 0.8,
    delay: 1.7,
    stagger: 0.2,
    ease: 'power2.out'
});

gsap.from('.connection-line:after', {
    scale: 0,
    duration: 0.5,
    delay: 2.2,
    stagger: 0.2,
    ease: 'back.out(1.7)'
});

// 웨이브 애니메이션
gsap.from('.wave-separator:before', {
    height: 0,
    duration: 0.8,
    delay: 1.5,
    ease: 'power2.out'
});

// 마스코트 애니메이션
gsap.from('.mascot-container', {
    y: -20,
    opacity: 0,
    duration: 1,
    delay: 2,
    ease: 'back.out(1.7)'
});

// Pick Up 애니메이션
gsap.from('.pick-up-container', {
    x: -20,
    opacity: 0,
    duration: 0.8,
    delay: 2.5,
    ease: 'power2.out'
});

// 제목 애니메이션
gsap.from('.crime-title', {
    x: -20,
    opacity: 0,
    duration: 0.8,
    delay: 2.7,
    ease: 'power2.out'
});

// 모든 차트 초기화
function initCharts() {
    try {
        console.log("차트 초기화 시작");
        initChronicDiseaseChart();
        initObesityChart();
        initHealthBehaviorChart();
        initFoodIntakeChart();
        console.log("차트 초기화 완료");
    } catch (error) {
        console.error("차트 초기화 중 오류 발생:", error);
    }
}

// 만성질환 유병률 차트
function initChronicDiseaseChart() {
    const ctx = document.getElementById('chronicDiseaseChart');
    
    if (!ctx) {
        console.error('chronicDiseaseChart 요소를 찾을 수 없습니다.');
        return;
    }
    
    const chronicDiseaseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['비만', '고혈압', '당뇨병', '고콜레스테롤혈증'],
            datasets: [
                {
                    label: '남성 (2023)',
                    data: [45.6, 23.4, 12.0, 19.9],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: '여성 (2023)',
                    data: [27.8, 16.5, 6.9, 21.4],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '성별에 따른 만성질환 유병률 (2023년)',
                    font: {
                        size: 14
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '유병률 (%)'
                    },
                    max: 50
                }
            }
        }
    });
}

// 연령별 비만율 변화 차트
function initObesityChart() {
    const ctx = document.getElementById('obesityChart');
    
    if (!ctx) {
        console.error('obesityChart 요소를 찾을 수 없습니다.');
        return;
    }
    
    const obesityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['20대', '30대', '40대', '50대', '60대 이상'],
            datasets: [
                {
                    label: '여성 (2022)',
                    data: [18.2, 21.8, 25.6, 30.2, 33.5],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: '여성 (2023)',
                    data: [22.1, 27.3, 26.2, 30.8, 33.2],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: '남성 (2022)',
                    data: [42.8, 47.5, 51.2, 46.8, 39.5],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: '남성 (2023)',
                    data: [43.9, 47.2, 50.8, 45.9, 39.0],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '연령별 비만율 변화 (2022-2023)',
                    font: {
                        size: 14
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '비만율 (%)'
                    },
                    max: 60
                }
            }
        }
    });
}

// 건강행태 추이 차트
function initHealthBehaviorChart() {
    const ctx = document.getElementById('healthBehaviorChart');
    
    if (!ctx) {
        console.error('healthBehaviorChart 요소를 찾을 수 없습니다.');
        return;
    }
    
    const healthBehaviorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [
                {
                    label: '남성 흡연율',
                    data: [43.2, 39.4, 40.7, 38.1, 36.7, 35.7, 34.0, 32.4, 30.0, 32.4],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: '여성 흡연율',
                    data: [5.7, 5.5, 6.4, 6.0, 7.5, 6.7, 6.6, 6.3, 5.0, 6.3],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: '유산소 신체활동 실천율',
                    data: [58.3, 55.1, 52.3, 48.5, 47.6, 43.2, 43.7, 47.6, 52.9, 52.5],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '건강행태 추이 (2014-2023)',
                    font: {
                        size: 14
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '비율 (%)'
                    },
                    max: 70
                }
            }
        }
    });
}

// 식품 섭취량 변화 차트
function initFoodIntakeChart() {
    const ctx = document.getElementById('foodIntakeChart');
    
    if (!ctx) {
        console.error('foodIntakeChart 요소를 찾을 수 없습니다.');
        return;
    }
    
    const foodIntakeChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['곡류', '과일류', '채소류', '육류', '음료류', '지방'],
            datasets: [
                {
                    label: '2014년',
                    data: [100, 100, 100, 100, 100, 100],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)'
                },
                {
                    label: '2023년',
                    data: [85, 75, 95, 125, 135, 130],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '식품 섭취량 상대 변화 (2014년 대비 2023년)',
                    font: {
                        size: 14
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `기준값 (2014년)`;
                            } else {
                                const change = context.raw - 100;
                                const sign = change > 0 ? '+' : '';
                                return `2023년: ${sign}${change}% 변화`;
                            }
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: false,
                    min: 50,
                    max: 150,
                    ticks: {
                        stepSize: 25
                    }
                }
            }
        }
    });
}

// 기능 슬라이더 초기화 함수
function initFeatureSlider() {
    const slider = document.querySelector('.features-slider');
    const cards = document.querySelectorAll('.feature-card:not(.clone)');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || cards.length === 0) {
        console.error('슬라이더 요소를 찾을 수 없습니다.');
        return;
    }
    
    console.log('기능 슬라이더 초기화 중...');
    
    // 슬라이더 설정
    let isAnimating = false;
    let startX = 0;
    let currentX = 0;
    let xDiff = 0;
    let autoPlayInterval;
    let isHovered = false;
    
    // 카드 너비와 보여질 카드 수 계산
    const cardWidth = cards[0].offsetWidth;
    const cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight);
    const cardFullWidth = cardWidth + 20; // 카드 너비 + gap
    
    // 자동 슬라이드 함수
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (!isHovered && !isAnimating) {
                moveSlider('next');
            }
        }, 3000);
    }
    
    // 슬라이더 이동 함수
    function moveSlider(direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        // 현재 첫 번째 카드
        const firstCard = slider.firstElementChild;
        // 현재 마지막 카드
        const lastCard = slider.lastElementChild;
        
        if (direction === 'next') {
            // 부드러운 트랜지션으로 이동
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = `translateX(-${cardFullWidth}px)`;
            
            // 트랜지션 완료 후 첫 번째 카드를 마지막으로 이동
            setTimeout(() => {
                slider.style.transition = 'none';
                slider.appendChild(firstCard);
                slider.style.transform = 'translateX(0)';
                isAnimating = false;
            }, 500);
        } else if (direction === 'prev') {
            // 먼저 마지막 카드를 첫 번째로 이동 (트랜지션 없이)
            slider.style.transition = 'none';
            slider.prepend(lastCard);
            slider.style.transform = `translateX(-${cardFullWidth}px)`;
            
            // 강제 리플로우 (reflow)
            slider.offsetHeight;
            
            // 부드러운 트랜지션으로 원래 위치로 이동
            slider.style.transition = 'transform 0.5s ease';
            slider.style.transform = 'translateX(0)';
            
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }
    }
    
    // 마우스 이벤트 리스너
    slider.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    slider.addEventListener('mouseleave', () => {
        isHovered = false;
    });
    
    // 버튼 이벤트 리스너
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(autoPlayInterval);
            moveSlider('prev');
            startAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearInterval(autoPlayInterval);
            moveSlider('next');
            startAutoPlay();
        });
    }
    
    // 터치 이벤트 (모바일)
    slider.addEventListener('touchstart', (e) => {
        clearInterval(autoPlayInterval);
        startX = e.touches[0].clientX;
        currentX = startX;
        
        // 트랜지션 제거
        slider.style.transition = 'none';
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (isAnimating) return;
        currentX = e.touches[0].clientX;
        xDiff = startX - currentX;
        
        // 드래그 효과 (제한된 범위 내에서)
        const translateValue = -Math.min(Math.max(-cardFullWidth, -xDiff), cardFullWidth);
        slider.style.transform = `translateX(${translateValue}px)`;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        // 트랜지션 다시 설정
        slider.style.transition = 'transform 0.5s ease';
        
        // 스와이프 방향에 따라 이동
        if (xDiff > 50) { // 왼쪽으로 스와이프 (다음 카드)
            moveSlider('next');
        } else if (xDiff < -50) { // 오른쪽으로 스와이프 (이전 카드)
            moveSlider('prev');
        } else { // 충분한 스와이프가 아니면 원래 위치로
            slider.style.transform = 'translateX(0)';
        }
        
        startAutoPlay();
    }, { passive: true });
    
    // 창 크기 변경 시 슬라이더 재설정
    window.addEventListener('resize', () => {
        clearInterval(autoPlayInterval);
        // 슬라이더 초기화
        slider.style.transition = 'none';
        slider.style.transform = 'translateX(0)';
        
        // 크기 재계산 (필요 시)
        startAutoPlay();
    });
    
    // 초기 애니메이션 효과
    gsap.from('.feature-card', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.2)',
        delay : 1
    });
    
    // 자동 슬라이드 시작
    startAutoPlay();
    
    console.log('기능 슬라이더 초기화 완료');
}

// DOM 로드 후 슬라이더 초기화 실행 (이미 다른 곳에서 호출 중)

// 구름 애니메이션
gsap.from('.cloud-1', {
    y: 30,
    opacity: 0,
    duration: 2,
    delay: 0.5,
    ease: 'power1.out',
    repeat: -1,
    yoyo: true,
    repeatDelay: 3
});

gsap.from('.cloud-2', {
    y: 20,
    opacity: 0,
    duration: 2.5,
    delay: 1.2,
    ease: 'power1.out',
    repeat: -1,
    yoyo: true,
    repeatDelay: 2.5
});

// 공지사항 섹션 애니메이션
gsap.from('.notice-section', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.notice-section',
        start: 'top 80%',
    }
});

// 제목 및 설명 애니메이션
gsap.from('.notice-title, .notice-description', {
    x: -30,
    opacity: 0,
    stagger: 0.2,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.notice-section',
        start: 'top 70%',
    }
});

// 버튼 애니메이션
gsap.from('.notice-button', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    delay: 0.8,
    ease: 'back.out(1.4)',
    scrollTrigger: {
        trigger: '.notice-section',
        start: 'top 70%',
    }
});

// 공지사항 카드 애니메이션
gsap.from('.notice-card', {
    y: 20,
    opacity: 0,
    stagger: 0.2,
    duration: 0.6,
    delay: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '.notice-section',
        start: 'top 70%',
    }
});

// 마스코트 애니메이션
gsap.from('.notice-mascot', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.2,
    ease: 'back.out(1.7)',
    scrollTrigger: {
        trigger: '.notice-section',
        start: 'top 70%',
    }
});
