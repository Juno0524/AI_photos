/**
 * 이미지를 업로드했을 때 호출되는 함수입니다.
 * input: 파일 업로드 엘리먼트
 */
function readURL(input) {
    // 1. 파일이 선택되었는지 확인합니다
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        // 2. 파일 읽기가 완료되었을 때 실행될 코드
        reader.onload = function (e) {
            // 업로드 안내 문구를 숨깁니다
            document.querySelector('.drag-text').style.display = 'none';

            // 미리보기 이미지를 보여줄 영역을 엽니다
            document.querySelector('.file-upload-image').style.display = 'block';

            // 이미지 src(주소)에 읽은 파일 데이터를 넣어줍니다
            document.querySelector('.file-upload-image-preview').src = e.target.result;

            // TODO: 여기서 나중에 AI 모델 예측 함수를 실행할 것입니다.
            // predict(); 
        };

        // 3. 파일을 읽습니다
        reader.readAsDataURL(input.files[0]);
    } else {
        // 파일 선택이 취소된 경우 초기화
        removeUpload();
    }
}

/**
 * 업로드 취소 또는 초기화 함수
 */
function removeUpload() {
    document.querySelector('.file-upload-input').value = ""; // input 값 초기화
    document.querySelector('.drag-text').style.display = 'block'; // 안내 문구 보이기
    document.querySelector('.file-upload-image').style.display = 'none'; // 미리보기 숨기기
    document.querySelector('.file-upload-image-preview').src = "#"; // 이미지 소스 리셋
}
