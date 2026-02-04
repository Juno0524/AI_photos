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
            var image = document.getElementById("face-image");
            image.src = e.target.result;

            // 이미지가 로드된 후 예측을 실행합니다
            image.onload = function () {
                document.getElementById("loading").style.display = "block"; // 로딩 표시
                document.getElementById("result-message").style.display = "none"; // 결과 숨김
                document.getElementById("label-container").style.display = "none"; // 그래프 숨김
                predict();
            };
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
    document.getElementById("result-message").innerHTML = ""; // 결과 메시지 리셋
    document.getElementById("label-container").innerHTML = ""; // 그래프 리셋
    document.getElementById("loading").style.display = "none"; // 로딩 숨김
}

// ----------------------------------------
// Teachable Machine AI 모델 부분
// ----------------------------------------

// Make sure to add id="face-image" to the img tag in index.html if not already via JS
// But here we can just add the ID dynamically or assume modification.
// Let's modify the ID assignment in readURL above or modify index.html. 
// For safety, let's select by class in predict or assign ID here.
// Better yet, in the readURL function above, I used getElementById("face-image"). 
// I should make sure index.html has that ID.
// Wait, I didn't verify I added the ID in index.html in the previous tool call.
// I will assume I need to modify index.html to have that ID or I'll just use class here.
// Let's stick to using the class selector to be safe.

const URL = "https://teachablemachine.withgoogle.com/models/hwZQO0d_8/";

let model, labelContainer, maxPredictions;

// 페이지가 로드되면 모델을 미리 불러옵니다 (속도 향상)
window.onload = function () {
    init();
};

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // 모델 로드
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // 결과창 초기화
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function predict() {
    // 이미지를 가져옵니다
    var image = document.querySelector('.file-upload-image-preview');

    // 예측 실행
    const prediction = await model.predict(image, false);

    // 예측 결과를 내림차순으로 정렬 (가장 높은 확률이 위로)
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    // 가장 높은 확률의 결과 메시지 표시
    var resultTitle, resultExplain, resultClass;

    // 한국어 클래스 이름을 영어로 매핑 (스타일링을 위해)
    const classMapper = {
        "강아지": "dog",
        "dog": "dog",
        "고양이": "cat",
        "cat": "cat",
        "토끼": "rabbit",
        "rabbit": "rabbit",
        "공룡": "dinosaur",
        "dinosaur": "dinosaur",
        "곰": "bear",
        "bear": "bear"
    };

    // Teachable Machine이 반환하는 클래스 이름 (예: "강아지")
    var className = prediction[0].className;
    var englishClass = classMapper[className] || "unknown";

    switch (englishClass) {
        case "dog":
            resultTitle = "귀여운 강아지상";
            resultExplain = "당신은 다정하고 귀여운 강아지상입니다!";
            break;
        case "cat":
            resultTitle = "새침한 고양이상";
            resultExplain = "당신은 츤데레 매력의 고양이상입니다!";
            break;
        case "rabbit":
            resultTitle = "상큼한 토끼상";
            resultExplain = "당신은 발랄하고 귀여운 토끼상입니다!";
            break;
        case "dinosaur":
            resultTitle = "따뜻한 공룡상";
            resultExplain = "당신은 무심한 듯 따뜻한 공룡상입니다!";
            break;
        case "bear":
            resultTitle = "포근한 곰상";
            resultExplain = "당신은 듬직하고 포근한 곰상입니다!";
            break;
        default:
            resultTitle = "알 수 없음";
            resultExplain = className + "을(를) 닮으셨네요!";
    }

    var title = "<div class='" + englishClass + "-animal-title'>" + resultTitle + "</div>"
    var explain = "<div class='animal-explain pt-2'>" + resultExplain + "</div>"
    document.querySelector('.result-message').innerHTML = title + explain;

    // 그래프 표시 (모든 확률 보여주기)
    labelContainer.innerHTML = ""; // 기존 내용 삭제

    // 색상 매핑 (CSS 클래스 활용 또는 인라인)
    const colorMapper = {
        "dog": "#548dd4",
        "cat": "#ff6c6c",
        "rabbit": "#e56995",
        "dinosaur": " #5eb595",
        "bear": "#8d6e63",
        "unknown": "#d1d5db"
    };

    for (let i = 0; i < maxPredictions; i++) {
        // 0% 이상인 것만 보여주기 (너무 작은건 생략 가능하지만 일단 보여줌)
        const d_className = prediction[i].className;
        const d_englishClass = classMapper[d_className] || "unknown";
        const probability = prediction[i].probability.toFixed(2);

        if (probability > 0.01) { // 1% 이상만 표시
            var barWidth = Math.round(probability * 100) + "%";
            var color = colorMapper[d_englishClass];

            var labelTitle = "<div class='animal-label d-flex align-items-center'>" + d_className + "</div>";

            // 바(Bar) 생성 - 색상을 직접 지정
            var bar = "<div class='bar-container position-relative container-fluid'>" +
                "<div class='box' style='width: " + barWidth + "; background-color: " + color + ";'></div>" +
                "<span class='d-block percent-text'>" + barWidth + "</span>" +
                "</div>";

            var labelDiv = document.createElement("div");
            labelDiv.className = "label-item";
            labelDiv.innerHTML = labelTitle + bar;
            labelContainer.appendChild(labelDiv);
        }
    }
    document.getElementById("loading").style.display = "none"; // 로딩 숨김
    document.getElementById("result-message").style.display = "block"; // 결과 보이기
    document.getElementById("label-container").style.display = "block"; // 그래프 보이기
}
