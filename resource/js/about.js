// 페이지 로드 시 슬라이더 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 로드 완료, 슬라이더 초기화");
    
    // 주요 기능 슬라이더 초기화
    initFeatureSlider();
    
    // 차트 및 기타 기능 초기화
    setTimeout(function() {
        initCharts();
        initScrollAnimation();
        initPurposeParallax();
    }, 500);
});

// 주요 기능 슬라이더 초기화
function initFeatureSlider() {
    // 필수 요소 가져오기
    const slides = document.querySelectorAll('.feature-slide');
    const track = document.querySelector('.features-track');
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');
    const progressFill = document.querySelector('.progress-fill');
    
    // 요소 존재 여부 확인
    if (!slides.length || !track || !leftArrow || !rightArrow || !progressFill) {
        console.error("슬라이더 필수 요소를 찾을 수 없습니다", {
            slides: slides.length,
            track: !!track,
            leftArrow: !!leftArrow,
            rightArrow: !!rightArrow,
            progressFill: !!progressFill
        });
        return;
    }
    
    console.log("슬라이더 요소 확인 완료:", {
        "슬라이드 수": slides.length
    });
    
    // 슬라이더 상태 관리
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // 슬라이드 업데이트 함수
    function updateSlide() {
        // 활성 슬라이드 설정
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0.5';
            }
        });
        
        // 슬라이드 이동
        const slideWidth = 100 / totalSlides;
        const moveX = -(currentSlide * slideWidth);
        
        // GSAP로 트랙 이동
        gsap.to(track, {
            x: moveX + '%',
            duration: 0.5,
            ease: 'power2.out'
        });
        
        // 프로그레스 바 업데이트
        const progressPercent = currentSlide / (totalSlides - 1) * 100;
        gsap.to(progressFill, {
            x: progressPercent + '%',
            duration: 0.5,
            ease: 'power2.out'
        });
        
        // 화살표 상태 업데이트
        leftArrow.style.opacity = currentSlide > 0 ? '1' : '0';
        rightArrow.style.opacity = currentSlide < totalSlides - 1 ? '1' : '0';
        
        console.log(`슬라이드 ${currentSlide + 1}/${totalSlides}로 이동`);
    }
    
    // 왼쪽 화살표 클릭 이벤트
    leftArrow.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    });
    
    // 오른쪽 화살표 클릭 이벤트
    rightArrow.addEventListener('click', function() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    });
    
    // 터치 이벤트 처리 (모바일용)
    let touchStartX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 50; // 스와이프 감지 임계값
        
        if (diff > threshold && currentSlide < totalSlides - 1) {
            // 왼쪽으로 스와이프 - 다음 슬라이드
            currentSlide++;
            updateSlide();
        } else if (diff < -threshold && currentSlide > 0) {
            // 오른쪽으로 스와이프 - 이전 슬라이드
            currentSlide--;
            updateSlide();
        }
    });
    
    // 마우스 휠 이벤트 처리
    const featuresSection = document.querySelector('.features');
    
    featuresSection.addEventListener('wheel', function(e) {
        // 섹션 내에 있는지 확인
        const rect = featuresSection.getBoundingClientRect();
        const isInside = 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom;
            
        if (!isInside) return;
        
        // 휠 방향에 따라 슬라이드 변경
        if (e.deltaY > 0 && currentSlide < totalSlides - 1) {
            // 아래로 스크롤 - 다음 슬라이드
            e.preventDefault();
            currentSlide++;
            updateSlide();
        } else if (e.deltaY < 0 && currentSlide > 0) {
            // 위로 스크롤 - 이전 슬라이드
            e.preventDefault();
            currentSlide--;
            updateSlide();
        }
    }, { passive: false });
    
    // 슬라이더 초기화
    // 초기 높이 설정
    document.querySelector('.features-horizontal-scroll').style.height = '450px';
    
    // 트랙 초기 스타일 설정
    track.style.display = 'flex';
    track.style.width = (totalSlides * 100) + '%';
    
    // 각 슬라이드 너비 설정
    slides.forEach(slide => {
        slide.style.width = (100 / totalSlides) + '%';
    });
    
    // 초기 상태로 업데이트
    updateSlide();
    
    console.log("슬라이더 초기화 완료");
}

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

// 스크롤 애니메이션
function initScrollAnimation() {
    const statsCards = document.querySelectorAll('.stats-card');
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    // 요소가 화면에 보이는지 확인하는 함수
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    };
    
    // 요소에 애니메이션 클래스 추가
    const addAnimationClass = (elements, className) => {
        elements.forEach((element) => {
            if (isElementInViewport(element) && !element.classList.contains(className)) {
                element.classList.add(className);
            }
        });
    };
    
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        addAnimationClass(statsCards, 'fade-in');
        addAnimationClass(highlightItems, 'fade-in');
    };
    
    // 초기 로드 시 한 번 실행하고 스크롤 이벤트 리스너 추가
    handleScroll();
    window.addEventListener('scroll', handleScroll);
}

// 목적 섹션 패럴랙스 효과
function initPurposeParallax() {
    // 전체 폭 목적 섹션 패럴랙스용 요소 찾기
    const fullwidthPurposeFigure = document.querySelector('.purpose-fullwidth .purpose-figure');
    const fullwidthFigureObjects = document.querySelectorAll('.purpose-fullwidth .purpose-figure-obj');
    
    // 전체 폭 목적 섹션 패럴랙스 적용
    if (fullwidthPurposeFigure && fullwidthFigureObjects.length > 0) {
        applyParallax(fullwidthPurposeFigure, fullwidthFigureObjects);
    }
    
    // 패럴랙스 효과 함수
    function applyParallax(figureElement, objectElements) {
        // 마우스 이동 이벤트 핸들러
        figureElement.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            
            // 마우스 위치를 0~1 범위로 정규화
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            // 각 이미지 요소에 다른 효과 적용
            objectElements.forEach((obj, index) => {
                const speed = 0.03 * (index + 1);
                const xOffset = (x - 0.5) * 30 * speed;
                const yOffset = (y - 0.5) * 30 * speed;
                
                obj.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
            });
        });
        
        // 마우스가 떠날 때 원래 위치로 복귀
        figureElement.addEventListener('mouseleave', function() {
            objectElements.forEach((obj) => {
                obj.style.transform = 'translate3d(0, 0, 0)';
            });
        });
    }
}