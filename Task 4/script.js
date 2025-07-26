const quizData = [
  { question: "HTML stands for?", options: ["HyperText Markup Language", "Home Tool Markup", "Hyperlinks and Text"], answer: 0 },
  { question: "CSS is used for?", options: ["Styling", "Scripting", "Structuring"], answer: 0 },
];

let currentQuestion = 0;
let score = 0;

function login() {
  const name = document.getElementById("username").value;
  if (name) {
    localStorage.setItem("username", name);
    showPage("video");
    document.getElementById("login-page").classList.add("hidden");
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");

  if (pageId === "quiz") loadQuestion();
  if (pageId === "progress") showProgress();
  if (id === "leaderboard") showLeaderboard();
}

function loadQuestion() {
  const quizSet = courseContent[selectedCourse]?.quiz || quizData;
  const q = quizSet[currentQuestion];
  document.getElementById("question").textContent = q.question;
  const options = document.getElementById("options");
  options.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (i === q.answer) score++;
      nextQuestion();
    };
    options.appendChild(btn);
  });
}


function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    localStorage.setItem("quizScore", score);
    document.getElementById("quiz-container").innerHTML = `<h3>Quiz Complete! Score: ${score}/${quizData.length}</h3>`;
  }
}

function showProgress() {
  const user = localStorage.getItem("username") || "Guest";
  const score = localStorage.getItem("quizScore") || 0;
  document.getElementById("progress-data").textContent = `${user}, your quiz score is ${score}/${quizData.length}`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

window.onload = () => {
  if (localStorage.getItem("username")) {
    document.getElementById("login-page").classList.add("hidden");
    showPage("video");
  }
};


function toggleDropdown() {
  const dropdown = document.getElementById("course-dropdown");
  dropdown.classList.toggle("hidden");
}

function selectCourse(courseName) {
  document.getElementById("selected-course").textContent = courseName;
  showPage("course-section");
  document.getElementById("course-dropdown").classList.add("hidden");
}

const courseContent = {
  "B.Tech": {
    video: "https://www.w3schools.com/html/movie.mp4",
    quiz: [
      { question: "What is a compiler?", options: ["Interpreter", "Translator", "Debugger"], answer: 1 },
    ]
  },
  "BCA": {
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    quiz: [
      { question: "BCA stands for?", options: ["Bachelor of Computer Apps", "Basic Comp Analysis", "Binary Coder Assoc"], answer: 0 },
    ]
  },
  "BBA": {
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    quiz: [
      { question: "BBA is a degree in?", options: ["Engineering", "Business", "Cooking"], answer: 1 },
    ]
  }
};

let selectedCourse = null;

function selectCourse(courseName) {
  selectedCourse = courseName;
  document.getElementById("selected-course").textContent = courseName;

  const course = courseContent[courseName];
  if (course) {
    document.querySelector("video source").src = course.video;
    document.querySelector("video").load();
  }

  showPage("course-section");
  document.getElementById("course-dropdown").classList.add("hidden");
}


function generateCertificate() {
  const canvas = document.getElementById("certificate");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    alert("Canvas not found or not supported.");
    return;
  }

  const username = localStorage.getItem("username") || "Guest";

  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fefefe";
  ctx.font = "30px Arial";
  ctx.fillText("Certificate of Completion", 200, 100);
  ctx.font = "20px Arial";
  ctx.fillText(`Presented to: ${username}`, 220, 200);
  ctx.fillText(`Course: ${selectedCourse}`, 220, 250);
  ctx.fillText(`Score: ${score}`, 220, 300);
  ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 220, 350);

  const link = document.createElement("a");
  link.download = "certificate.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}



function showLeaderboard() {
  db.collection("progress").orderBy("score", "desc").limit(10).get().then(snapshot => {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement("li");
      item.textContent = `${data.email} - ${data.score}`;
      list.appendChild(item);
    });
  });
}
