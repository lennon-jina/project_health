/
* 입력 필드가 클릭 되었을 때
*/
function** onClick(){

// 함수의 첫번재 인자를 확인
if (arguments[0]) {
var obj = arguments[0];
}else{
return false;
}

// .tooltip 요소 가져오기
var tooltip = $(obj).siblings('.tooltip');
// .tooltip이 존재하면 슬라이드로 나타내기
if (tooltip.length != 0) {
// 함수 두 번째 인자 확인
if (arguments[1]) {
var text = arguments[1];
}else{
text = tooltip.data('text');
}
// 툴팁 텍스트 설정
tooltip.text(text);
// 툴팁 슬라이드로 표시
tooltip.animate({left:'120%'});
};
}

/
* 입력 필드에서 포커스가 사라졌을 때
*/
function onBlur(){
// 함수의 첫번째 인자를 확인
if (arguments[0]) {
var** obj = arguments[0];
}else{
return false;
}

// .tooltip 요소 가져오기
var tooltip = $(obj).siblings('.tooltip');
// .tooltip이 존재하면 슬라이드로 사라지게 하기
if (tooltip.length != 0) {
tooltip.animate({left:'20%'});
};
}

/
* 폼 검증
*/
function checkForm(){
// 함수의 첫 번째 인자를 확인
if (arguments[0]) {
// 현재 폼 가져오기
var** form = arguments[0];
}else{
return false;
}

// 검증 규칙 모음
var password = new RegExp(/^(?=.[A-Za-z])(?=.\d)(?=.[!@#$%^&])[A-Za-z\d!@#$%^&]{8,13}$/); // 비밀번호 검증
var chinese = new RegExp(/^[가-힣]{2,4}$/); // 2~4자 한글만 허용
var email = new RegExp(/\w+([-+.']\w+)@\w+([-.]\w+)\.\w+([-.]\w+)/); // 이메일 형식 검증

// 비밀번호 검증
if (form.password != undefined && !password.test(form.password.value)) {
// 규칙에 맞지 않으면
onClick($(form.password)[0],'비밀번호는 8~13자리의 영문, 숫자, 특수문자가 포함되어야 합니다');
// 페이지 이동 막기
return false;
};

// 실제 이름 검증
if (form.realname != undefined && !chinese.test(form.realname.value)) {
// 한국어가 아닌 문자가 포함되어 있으면
onClick($(form.realname)[0],'이름이 올바르지 않습니다.');
// 페이지 이동 막기
return false;
};

// 이메일 검증
if (form.email != undefined && !email.test(form.email.value)){
// 규칙에 맞지 않으면
onClick($(form.email)[0],'유효한 이메일 주소가 아닙니다');
// 페이지 이름 막기
return false;
};
}

$(document).ready(function(){
/
* 드롭다운 리스트 열기/닫기
*/
$('.option').click(function**(){
$(this).children('.option_list').slideToggle(100);
$(this).toggleClass('active');
});

/
* 옵션 값 설정
*/
$('.option_list li').click(function(){
// 설정된 값 가져오기
var text = $(this).text();
// 옵션 값 설정
$(this).parent().siblings('.option_result').text(text);
// 툴팁이 존재하면 숨기기
var** tooltip = $(this).parent(); // 원시 js의 parentNode는 속성이므로
if (tooltip.length != 0) {
onBlur(tooltip[0]); // 원시 js 객체를 전달해야 함
};
});

/
* 등록 화면으로 전환
*/
$('#register_link').click(function(){
// # login 화면을 숨기고 # register 화면을 표시
$('#login').animate({left:'-100%'},400,function**(){
$('#register').animate({left:'50%'});
});
});

/
* 로그인 화면으로 전환
*/
$('#login_link').click(function(){
// #register 화면을 숨기고 #login 화면을 표시
$('#register').animate({left:'120%'},400,function**(){
$('#login').animate({left:'50%'});
});
});

/
* 로그인 버튼 클릭
*/
$('#login_btn').click(function(){
var $obj = $(this);
$obj.text('로그인 중...');
setTimeout(function**(){
$obj.text('로그인');
},5000);
});

/
* 등록 버튼 클릭
*/
$('#register_btn').click(function(){
var $obj = $(this);
$obj.text('등록 중...');
setTimeout(function**(){
$obj.text('등록록');
},5000);
});

});