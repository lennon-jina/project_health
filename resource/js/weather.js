// 전역 변수 선언
let map;
let marker;
let geocoder;
let weatherData = null;
let dustData = null;

// 미세먼지 등급에 따른 메시지 및 아이콘 정의
const dustStatusMessages = {
  '좋음': {
    icon: 'fa-smile',
    emoji: '🌿',
    title: '야외 운동하기 최적의 날이에요!',
    message: '오늘은 공기 질이 아주 좋아요. 공원 산책, 가벼운 달리기, 자전거 타기 등 적극 추천! 💨💪',
    className: 'status-good'
  },
  '보통': {
    icon: 'fa-smile-beam',
    emoji: '🌤️',
    title: '야외 운동해도 괜찮아요!',
    message: '미세먼지가 보통 수준이지만 큰 문제는 없어요. 민감하지 않다면 야외 활동 가능! 간단한 마스크 챙기면 더 좋아요 😷',
    className: 'status-moderate'
  },
  '나쁨': {
    icon: 'fa-frown',
    emoji: '🌫️',
    title: '야외 운동은 오늘은 쉬어가는 게 어때요?',
    message: '공기 질이 안 좋아요. 가급적 실내에서 운동해보세요. 부득이하게 외출할 땐 마스크 착용 필수!',
    className: 'status-bad'
  },
  '매우나쁨': {
    icon: 'fa-dizzy',
    emoji: '🚨',
    title: '절대 야외 운동 금지!',
    message: '오늘은 미세먼지가 매우 심각해요. 실내에서 충분히 환기된 공간에서 가볍게 스트레칭만 추천! 기저질환자는 특히 주의하세요.',
    className: 'status-very-bad'
  }
};

// 날씨 상태에 따른 메시지 및 아이콘 정의
const weatherStatusMessages = {
  '맑음': {
    icon: 'fa-sun',
    emoji: '☀️',
    title: '맑은 날씨, 야외 운동하기 좋아요!',
    message: '오늘은 맑고 화창한 날씨예요. 햇빛을 즐기며 야외 운동을 하기 좋은 날이에요.',
    className: 'status-good'
  },
  '구름많음': {
    icon: 'fa-cloud-sun',
    emoji: '⛅',
    title: '구름이 있지만 야외 운동 가능해요',
    message: '구름이 약간 있지만 야외 활동하기에 충분히 좋은 날씨예요. 자외선도 적당해서 햇빛 부담이 적어요.',
    className: 'status-good'
  },
  '흐림': {
    icon: 'fa-cloud',
    emoji: '☁️',
    title: '흐린 날씨, 야외 운동 가능해요',
    message: '구름이 많아도 운동하기에는 지장이 없어요. 햇빛이 강하지 않아 장시간 야외 활동에 적합해요.',
    className: 'status-moderate'
  },
  '비': {
    icon: 'fa-cloud-rain',
    emoji: '🌧️',
    title: '비가 와요, 실내 운동을 추천해요',
    message: '오늘은 비가 오고 있어요. 야외 운동보다는 실내 운동을 추천드려요.',
    className: 'status-bad'
  },
  '눈': {
    icon: 'fa-snowflake',
    emoji: '❄️',
    title: '눈이 와요, 실내 운동을 추천해요',
    message: '오늘은 눈이 오고 있어요. 미끄러워 부상 위험이 있으니 실내 운동을 추천드려요.',
    className: 'status-bad'
  }
};

// 종합 평가 상태 정의
const combinedStatusMessages = {
  '최상': {
    icon: 'fa-laugh-beam',
    emoji: '🏃‍♂️',
    title: '오늘은 야외 운동하기 최적의 날!',
    message: '날씨도 좋고 미세먼지도 좋아요. 야외에서 마음껏 운동하세요!',
    className: 'status-good',
    outdoorSuggestions: [
      '공원에서 조깅이나 달리기',
      '자전거 타기',
      '등산하기',
      '테니스, 배드민턴 등의 야외 스포츠',
      '야외 요가나 필라테스'
    ],
    indoorSuggestions: []
  },
  '좋음': {
    icon: 'fa-smile',
    emoji: '🚶‍♀️',
    title: '오늘은 야외 운동하기 좋은 날',
    message: '대체로 야외 활동하기 좋은 컨디션이에요. 적절한 야외 운동을 즐겨보세요.',
    className: 'status-good',
    outdoorSuggestions: [
      '가벼운 산책이나 조깅',
      '공원에서 맨몸 운동',
      '자전거 타기',
      '가벼운 구기 스포츠'
    ],
    indoorSuggestions: []
  },
  '보통': {
    icon: 'fa-meh',
    emoji: '🤔',
    title: '야외 운동이 가능하지만 주의가 필요해요',
    message: '야외 활동이 가능하나, 민감한 분들은 주의하세요. 가벼운 야외 운동이나 실내 운동 모두 괜찮아요.',
    className: 'status-moderate',
    outdoorSuggestions: [
      '짧은 시간의 가벼운 산책',
      '마스크를 착용한 가벼운 야외 활동'
    ],
    indoorSuggestions: [
      '실내 홈트레이닝',
      '헬스장에서의 근력 운동',
      '실내 수영'
    ]
  },
  '나쁨': {
    icon: 'fa-frown',
    emoji: '🏠',
    title: '오늘은 실내 운동을 추천드려요',
    message: '날씨나 미세먼지 상태가 좋지 않아요. 야외보다는 실내에서 운동하세요.',
    className: 'status-bad',
    outdoorSuggestions: [],
    indoorSuggestions: [
      '홈트레이닝',
      '실내 요가나 스트레칭',
      '헬스장 이용하기',
      '실내 수영장 이용하기',
      '홈사이클이나 러닝머신'
    ]
  },
  '위험': {
    icon: 'fa-dizzy',
    emoji: '⚠️',
    title: '야외 운동은 절대 금지!',
    message: '오늘은 야외 활동이 건강에 해로울 수 있어요. 반드시 실내에서만 운동하세요.',
    className: 'status-very-bad',
    outdoorSuggestions: [],
    indoorSuggestions: [
      '집에서 가벼운 스트레칭',
      '요가',
      '가볍게 홈트레이닝',
      '충분히 환기된 실내 공간에서의 운동',
      '실내 수영장 (공기 순환이 잘 되는 곳)'
    ]
  }
};

// 지도 업데이트
function updateMap(latitude, longitude) {
  const latlng = new kakao.maps.LatLng(latitude, longitude);
  
  // 지도 중심 이동
  map.setCenter(latlng);
  
  // 마커 위치 업데이트
  marker.setPosition(latlng);
  
  // 좌표 정보 업데이트
  document.getElementById('coordinates').textContent = `위도 ${latitude.toFixed(6)}, 경도 ${longitude.toFixed(6)}`;
  
  // 주소 정보 가져오기
  geocoder.coord2Address(longitude, latitude, function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
      const address = result[0].address.address_name || '주소 정보 없음';
      document.getElementById('currentAddress').textContent = address;
    } else {
      document.getElementById('currentAddress').textContent = '주소 정보를 가져올 수 없습니다.';
    }
  });
}

// 위도/경도 → nx/ny 격자 변환 함수 (기상청 공식 버전)
function convertGrid(lat, lon) {
  const RE = 6371.00877; // 지구 반경 (km)
  const GRID = 5.0; // 격자 간격 (km)
  const SLAT1 = 30.0; // 표준위도1
  const SLAT2 = 60.0; // 표준위도2
  const OLON = 126.0; // 기준경도
  const OLAT = 38.0; // 기준위도
  const XO = 43; // 기준 X좌표
  const YO = 136; // 기준 Y좌표

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = re * sf / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + (lat) * DEGRAD * 0.5);
  ra = re * sf / Math.pow(ra, sn);

  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx: x, ny: y };
}

// 현재 시간 기준 base_date, base_time 설정
function getBaseDateTime() {
  const now = new Date();
  let baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
  let baseTime = '';

  const hour = now.getHours();
  if (hour < 2) {
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    baseDate = yesterday.toISOString().slice(0, 10).replace(/-/g, '');
    baseTime = '2300';
  } else if (hour < 5) baseTime = '0200';
  else if (hour < 8) baseTime = '0500';
  else if (hour < 11) baseTime = '0800';
  else if (hour < 14) baseTime = '1100';
  else if (hour < 17) baseTime = '1400';
  else if (hour < 20) baseTime = '1700';
  else if (hour < 23) baseTime = '2000';
  else baseTime = '2300';

  return { baseDate, baseTime };
}

// 날씨 정보 화면 업데이트
function updateWeatherInfo(data) {
  const weatherInfo = document.getElementById('weatherInfo');
  
  const html = `
    <div class="weather-card">
      <div class="weather-icon">
        <i class="fas ${data.statusInfo.icon}"></i>
      </div>
      <div class="weather-details">
        <div class="weather-temp">${data.temperature}°C</div>
        <div class="weather-desc">${data.status} ${data.statusInfo.emoji}</div>
        <div class="weather-meta">
          <div class="weather-meta-item">
            <i class="fas fa-tint"></i> 습도 ${data.humidity}%
          </div>
          <div class="weather-meta-item">
            <i class="fas fa-umbrella"></i> 강수확률 ${data.rainProbability}%
          </div>
        </div>
      </div>
    </div>
    <div class="dust-info ${data.statusInfo.className}">
      <div class="dust-status">
        <i class="fas ${data.statusInfo.icon}"></i> ${data.statusInfo.title}
      </div>
      <div class="dust-message">${data.statusInfo.message}</div>
    </div>
  `;
  
  weatherInfo.innerHTML = html;
}

// 날씨 정보 가져오기
async function fetchWeatherData(lat, lon) {
  try {
    // API key - 실제 사용 시 본인의 키로 교체 필요
    const serviceKey = "f82yPXMXNwVt%2Bs0bhbI6wzLIZDCJ%2FE5qXCVZc6YCiU2r%2F9c9mT8aX5v6E9wTaNqWIRKusEqdAmc2KOp23FetzA%3D%3D";
    
    const { nx, ny } = convertGrid(lat, lon);
    const { baseDate, baseTime } = getBaseDateTime();
    
    // API 호출
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('날씨 API 호출 실패');
    }
    
    const data = await response.json();
    console.log("날씨 데이터:", data);
    
    // 데이터 파싱
    const items = data.response.body.items.item;
    
    // 필요한 날씨 정보 추출
    const temp = items.find(x => x.category === 'TMP')?.fcstValue || '정보 없음';
    const skyStatus = items.find(x => x.category === 'SKY')?.fcstValue || '1';
    const ptyStatus = items.find(x => x.category === 'PTY')?.fcstValue || '0';
    const humidity = items.find(x => x.category === 'REH')?.fcstValue || '정보 없음';
    const rainProb = items.find(x => x.category === 'POP')?.fcstValue || '정보 없음';
    
    // 하늘 상태 및 강수 형태 해석
    let weatherStatus = '맑음';
    let weatherIcon = 'fa-sun';
    
    // 강수 형태 (PTY) 먼저 확인 (비/눈 등)
    if (ptyStatus === '1' || ptyStatus === '2') {
      weatherStatus = '비';
      weatherIcon = 'fa-cloud-rain';
    } else if (ptyStatus === '3') {
      weatherStatus = '눈';
      weatherIcon = 'fa-snowflake';
    } else if (ptyStatus === '4') {
      weatherStatus = '소나기';
      weatherIcon = 'fa-cloud-showers-heavy';
    } else {
      // 하늘 상태 (SKY) 확인
      if (skyStatus === '1') {
        weatherStatus = '맑음';
        weatherIcon = 'fa-sun';
      } else if (skyStatus === '3') {
        weatherStatus = '구름많음';
        weatherIcon = 'fa-cloud-sun';
      } else if (skyStatus === '4') {
        weatherStatus = '흐림';
        weatherIcon = 'fa-cloud';
      }
    }
    
    // 날씨 상태 정보
    const statusInfo = weatherStatusMessages[weatherStatus] || weatherStatusMessages['맑음'];
    
    // 날씨 데이터 저장
    weatherData = {
      temperature: temp,
      status: weatherStatus,
      humidity: humidity,
      rainProbability: rainProb,
      statusInfo: statusInfo
    };
    
    // 날씨 정보 화면 업데이트
    updateWeatherInfo(weatherData);
    
  } catch (error) {
    console.error("날씨 데이터 가져오기 오류:", error);
    throw new Error('날씨 정보를 가져오는데 실패했습니다.');
  }
}

// 미세먼지 정보 가져오기
async function fetchDustData() {
  try {
    // API key - 실제 사용 시 본인의 키로 교체 필요
    const apiKey = "f82yPXMXNwVt%2Bs0bhbI6wzLIZDCJ%2FE5qXCVZc6YCiU2r%2F9c9mT8aX5v6E9wTaNqWIRKusEqdAmc2KOp23FetzA%3D%3D";
    
    // 선택된 지역 가져오기
    const selectedRegion = document.getElementById('regionSelect').value;
    
    // 오늘 날짜 구하기
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    
    // API 요청
    const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?serviceKey=${apiKey}&returnType=json&numOfRows=100&pageNo=1&searchDate=${today}&InformCode=PM10`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('미세먼지 API 응답이 올바르지 않습니다');
    }
    
    const data = await response.json();
    console.log("미세먼지 예보 데이터:", data);
    
    // 데이터 처리
    const forecasts = data.response?.body?.items;
    
    if (!forecasts || forecasts.length === 0) {
      throw new Error('미세먼지 예보 데이터가 없습니다.');
    }
    
    // 첫 번째 예보 정보 가져오기
    const todayForecast = forecasts[0];
    
    // 지역별 미세먼지 정보 파싱
    const regionDustInfo = parseRegionDustInfo(todayForecast, selectedRegion);
    
    // 미세먼지 데이터 저장
    dustData = {
      region: regionDustInfo.region,
      status: regionDustInfo.status,
      statusInfo: dustStatusMessages[regionDustInfo.status] || dustStatusMessages['보통'],
      overallForecast: todayForecast.informOverall || '정보 없음',
      cause: todayForecast.informCause || '정보 없음',
      imageUrls: [
        todayForecast.imageUrl1,
        todayForecast.imageUrl2,
        todayForecast.imageUrl3, 
        todayForecast.imageUrl4,
        todayForecast.imageUrl5,
        todayForecast.imageUrl6
      ]
    };
    
    // 미세먼지 정보 화면 업데이트
    updateDustInfo(dustData);
    
    // 예측 이미지 업데이트
    updateForecastImages(dustData.imageUrls);
    
  } catch (error) {
    console.error("미세먼지 데이터 불러오기 오류:", error);
    throw new Error('미세먼지 정보를 가져오는데 실패했습니다.');
  }
}

// 지역별 미세먼지 정보 파싱 함수
function parseRegionDustInfo(forecast, region) {
  let dustStatus = '보통';
  
  // 지역 정보가 있는 필드들
  const regionInfoFields = ['informGrade'];
  
  for (const field of regionInfoFields) {
    if (forecast[field] && forecast[field].includes(region)) {
      // 지역 정보에서 미세먼지 등급 추출 (예: "서울 : 나쁨, 인천 : 보통...")
      const regionPattern = new RegExp(`${region}\\s*:\\s*([가-힣]+)`);
      const match = forecast[field].match(regionPattern);
      
      if (match && match[1]) {
        dustStatus = match[1].replace(/\s+/g, ''); // 공백 제거
        break;
      }
    }
  }
  
  return {
    region: region,
    status: dustStatus
  };
}

// 미세먼지 정보 화면 업데이트
function updateDustInfo(data) {
  const dustInfo = document.getElementById('dustInfo');
  
  const html = `
    <div class="dust-info ${data.statusInfo.className}">
      <div class="dust-status">
        <i class="fas ${data.statusInfo.icon}"></i> ${data.region}지역 미세먼지: ${data.status}
      </div>
      <div class="dust-message">${data.statusInfo.title} - ${data.statusInfo.message}</div>
      <div class="dust-meta">
        <p><strong>전체 예보 개황:</strong> ${data.overallForecast}</p>
        <p><strong>발생 원인:</strong> ${data.cause}</p>
      </div>
    </div>
  `;
  
  dustInfo.innerHTML = html;
}

// 예측 이미지 업데이트
function updateForecastImages(imageUrls) {
  const forecastImagesContainer = document.getElementById('forecastImages');
  
  // 이미지 시간대 레이블 정의
  const timeLabels = ['6시', '12시', '18시', '24시', '내일 6시', '내일 12시'];
  
  // HTML 생성
  let html = '';
  
  imageUrls.forEach((url, index) => {
    if (url) {
      html += `
        <div class="gallery-item">
          <h4>${timeLabels[index]}</h4>
          <img src="${url}" alt="${timeLabels[index]} 예측">
        </div>
      `;
    }
  });
  
  forecastImagesContainer.innerHTML = html;
}

// 종합 평가 생성
function generateCombinedRecommendation() {
  if (!weatherData || !dustData) {
    return;
  }
  
  // 종합 상태 평가
  let combinedStatus;
  
  // 날씨 상태 점수 (0-4)
  let weatherScore = 0;
  if (weatherData.status === '맑음') weatherScore = 4;
  else if (weatherData.status === '구름많음') weatherScore = 3;
  else if (weatherData.status === '흐림') weatherScore = 2;
  else if (weatherData.status === '비' || weatherData.status === '소나기') weatherScore = 0;
  else if (weatherData.status === '눈') weatherScore = 0;
  
  // 미세먼지 상태 점수 (0-4)
  let dustScore = 0;
  if (dustData.status === '좋음') dustScore = 4;
  else if (dustData.status === '보통') dustScore = 3;
  else if (dustData.status === '나쁨') dustScore = 1;
  else if (dustData.status === '매우나쁨') dustScore = 0;
  
  // 온도 점수 (0-2)
  let tempScore = 1;
  const temp = Number(weatherData.temperature);
  if (temp >= 15 && temp <= 25) tempScore = 2; // 적정 온도
  else if (temp < 0 || temp > 35) tempScore = 0; // 극단적 온도
  
  // 총 점수 (0-10)
  const totalScore = weatherScore + dustScore + tempScore;
  
  // 종합 상태 결정
  if (totalScore >= 9) combinedStatus = '최상';
  else if (totalScore >= 7) combinedStatus = '좋음';
  else if (totalScore >= 5) combinedStatus = '보통';
  else if (totalScore >= 2) combinedStatus = '나쁨';
  else combinedStatus = '위험';
  
  // 비나 눈이 오거나 미세먼지가 매우 나쁨이면 무조건 '위험' 또는 '나쁨'
  if (weatherData.status === '비' || weatherData.status === '눈' || 
      weatherData.status === '소나기' || dustData.status === '매우나쁨') {
    combinedStatus = totalScore >= 2 ? '나쁨' : '위험';
  }
  
  // 상태 정보 가져오기
  const statusInfo = combinedStatusMessages[combinedStatus];
  
  // 화면 업데이트
  updateCombinedRecommendation(statusInfo, combinedStatus);
}

// 종합 평가 화면 업데이트
function updateCombinedRecommendation(statusInfo, status) {
  const recommendationInfo = document.getElementById('recommendationInfo');
  
  let outdoorSuggestionsList = '';
  if (statusInfo.outdoorSuggestions.length > 0) {
    outdoorSuggestionsList = `
      <h3>추천 야외 운동</h3>
      <ul class="suggestion-list">
        ${statusInfo.outdoorSuggestions.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }
  
  let indoorSuggestionsList = '';
  if (statusInfo.indoorSuggestions.length > 0) {
    indoorSuggestionsList = `
      <h3>추천 실내 운동</h3>
      <ul class="suggestion-list">
        ${statusInfo.indoorSuggestions.map(item => `<li>${item}</li>`).join('')}
      </ul>
    `;
  }
  
  const html = `
    <div class="recommendation-info ${statusInfo.className}">
      <div class="recommendation-status">
        <i class="fas ${statusInfo.icon}"></i> ${statusInfo.title}
      </div>
      <div class="recommendation-message">${statusInfo.message}</div>
      <div class="exercise-suggestions">
        ${outdoorSuggestionsList}
        ${indoorSuggestionsList}
      </div>
    </div>
  `;
  
  recommendationInfo.innerHTML = html;
}

// 시간대별 예측 이미지 갤러리 토글 함수
function toggleImageGallery() {
  const gallery = document.getElementById('imageGallery');
  const btn = document.getElementById('toggleGalleryBtn');
  
  if (gallery.style.display === 'none' || gallery.style.display === '') {
    gallery.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i> 시간대별 공기질 예측 숨기기';
  } else {
    gallery.style.display = 'none';
    btn.innerHTML = '<i class="fas fa-chevron-down"></i> 시간대별 공기질 예측 보기';
  }
}

// 로딩 표시/숨김 함수
function showLoading(show) {
  document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

// 에러 메시지 표시 함수
function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.querySelector('p').textContent = message || '데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
  errorElement.style.display = 'block';
}

// 에러 메시지 숨김 함수
function hideError() {
  document.getElementById('errorMessage').style.display = 'none';
}

// 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
  // 버튼 이벤트 리스너 설정
  document.getElementById('getInfoBtn').addEventListener('click', getInfo);
  document.getElementById('toggleGalleryBtn').addEventListener('click', toggleImageGallery);
  document.getElementById('regionSelect').addEventListener('change', fetchDustData);
  
  // Kakao Maps API 초기화
  if (typeof kakao !== 'undefined' && kakao.maps) {
    initializeMap();
  }
});

// 지도 초기화 함수
function initializeMap() {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청
    level: 3
  };
  
  map = new kakao.maps.Map(container, options);
  
  // 지오코더 초기화
  geocoder = new kakao.maps.services.Geocoder();
  
  // 마커 생성
  marker = new kakao.maps.Marker({
    position: map.getCenter()
  });
  marker.setMap(map);
}

// 정보 가져오기 메인 함수
async function getInfo() {
  // 화면 초기화
  showLoading(true);
  hideError();
  
  try {
    // 현재 위치 가져오기
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    
    // 지도 업데이트
    updateMap(latitude, longitude);
    
    // 날씨 정보 가져오기
    await fetchWeatherData(latitude, longitude);
    
    // 미세먼지 정보 가져오기
    await fetchDustData();
    
    // 종합 평가 생성
    generateCombinedRecommendation();
    
    // 컨텐츠 표시
    document.querySelector('.content-wrapper').style.display = 'grid';
    
  } catch (error) {
    console.error("정보 가져오기 오류:", error);
    showError(error.message);
  } finally {
    showLoading(false);
  }
}

// 현재 위치 가져오기
function getCurrentPosition() {
  return new Promise((resolve) => {
    resolve({
      coords: {
        latitude: 36.3516,
        longitude: 127.3849
      }
    });
  });
}