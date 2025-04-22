// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Элементы DOM
const startBtn = document.getElementById('startBtn');
const practiceBtn = document.getElementById('practiceBtn');
const gameArea = document.getElementById('gameArea');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const resultEl = document.getElementById('result');
const statsEl = document.getElementById('stats');
const modeInfo = document.getElementById('modeInfo');

// Переменные игры
let a = 0;
let b = 0;
let correctAnswer = 0;
let isTestMode = false;
let correctCount = 0;
let totalCount = 0;
let questions = [];

// Инициализация всех возможных вопросов
function initQuestions() {
    questions = [];
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10; j++) {
            questions.push({a: i, b: j});
        }
    }
    shuffleArray(questions);
}

// Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Начало теста
startBtn.addEventListener('click', () => {
    isTestMode = true;
    correctCount = 0;
    totalCount = 0;
    initQuestions();
    gameArea.style.display = 'block';
    modeInfo.textContent = 'Режим: Тест (20 случайных вопросов)';
    nextQuestion();
});

// Начало тренировки
practiceBtn.addEventListener('click', () => {
    isTestMode = false;
    correctCount = 0;
    totalCount = 0;
    initQuestions();
    gameArea.style.display = 'block';
    modeInfo.textContent = 'Режим: Тренировка (бесконечные вопросы)';
    nextQuestion();
});

// Следующий вопрос
function nextQuestion() {
    if (isTestMode && totalCount >= 20) {
        endTest();
        return;
    }
    
    answerInput.value = '';
    resultEl.textContent = '';
    resultEl.className = 'result';
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    answerInput.focus();
    
    if (isTestMode) {
        // В тестовом режиме берем вопросы по порядку из перемешанного массива
        const question = questions[totalCount];
        a = question.a;
        b = question.b;
    } else {
        // В тренировочном режиме - полностью случайные вопросы
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
    }
    
    correctAnswer = a * b;
    questionEl.textContent = `${a} × ${b} = ?`;
    
    if (!isTestMode) {
        updateStats();
    }
}

// Проверка ответа
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) {
        resultEl.textContent = 'Пожалуйста, введите число';
        resultEl.className = 'result incorrect';
        return;
    }
    
    totalCount++;
    
    if (userAnswer === correctAnswer) {
        resultEl.textContent = 'Правильно! 👍';
        resultEl.className = 'result correct';
        correctCount++;
    } else {
        resultEl.textContent = `Неправильно. Правильный ответ: ${correctAnswer}`;
        resultEl.className = 'result incorrect';
    }
    
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    
    updateStats();
}

// Обновление статистики
function updateStats() {
    if (isTestMode) {
        statsEl.textContent = `Вопрос ${totalCount} из 20 | Правильно: ${correctCount}`;
    } else {
        statsEl.textContent = `Всего вопросов: ${totalCount} | Правильно: ${correctCount}`;
    }
}

// Завершение теста
function endTest() {
    gameArea.style.display = 'none';
    const percentage = Math.round((correctCount / 20) * 100);
    modeInfo.innerHTML = `
        <h2>Тест завершен!</h2>
        <p>Правильных ответов: ${correctCount} из 20</p>
        <p>Результат: ${percentage}%</p>
        <p>${getTestComment(percentage)}</p>
    `;
}

// Комментарий к результату теста
function getTestComment(percentage) {
    if (percentage === 100) return 'Отлично! Ты знаешь таблицу умножения на 5+!';
    if (percentage >= 80) return 'Хороший результат! Продолжай тренироваться!';
    if (percentage >= 50) return 'Неплохо, но нужно еще потренироваться';
    return 'Тебе нужно серьезно поработать над таблицей умножения';
}

// Обработчик кнопки "Следующий вопрос"
nextBtn.addEventListener('click', nextQuestion);
