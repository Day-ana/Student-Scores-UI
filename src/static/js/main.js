(function() {
  let btnExam = document.querySelector("#exams");
  let btnStud = document.querySelector("#students");
  let examContainer = document.querySelector(".exams-container");
  let studContainer = document.querySelector(".students-container");
  let scoresRow = document.querySelector("#scores-table");
  let studentRow = document.querySelector("#student-table");
  let examRow = document.querySelector("#exam-table");
  let singleExamContainer = document.querySelector(".single-exam-container");
  let singleStudContainer = document.querySelector(".single-student-container");

  function clearViews() {
    console.log("clearViews called....");

    // Remove Views
    examContainer.style.display = "none";
    studContainer.style.display = "none";
    singleExamContainer.style.display = "none";
    singleStudContainer.style.display = "none";
  }

  function getRank(score) {
    console.log("getRank called....");

    let rankArr = [];
    // Push scores to new array
    score.results.forEach(rank => {
      rankArr.push(rank.score);
    });
    // Sort the scores
    var sorted = rankArr.slice().sort(function(a, b) {
      return b - a;
    });
    // Return ranking results
    var ranks = rankArr.slice().map(function(v) {
      return sorted.indexOf(v) + 1;
    });
    return (rankObj = score.results.map((props, i) => {
      // Set new property of rank
      props.rank = ranks[i];
    }));
  }

  function renderExams(exams) {
    console.log("renderExams called....");

    // Remove visible views and render Exam Container
    clearViews();
    examContainer.style.display = "block";

    // Iterate through obj and populate data
    scoresRow.innerHTML = " ";
    let html = ` `;
    exams.exams.forEach(exam => {
      html = `<tr class="getClassInfo" id="${exam.id}">
          <td>Exam ${exam.id}</td><td>${exam.average}</td><td>${
        exam.studentCount
      }</td>
        </tr>`;
      scoresRow.innerHTML += html;
    });
    getExam();
  }

  function getExam(id) {
    console.log("getExam called....");
    // Adding listeners for rows
    let classInfoBtn = document.querySelectorAll(".getClassInfo");
    classInfoBtn.forEach(btn => {
      btn.addEventListener("click", function(e) {
        // Get id from <tr>
        getExamApi(e.path[1].id);
      });
    });
  }

  function getExamApi(id) {
    console.log("getExamApi called...." + id);

    // Get data for single exam
    fetch(`http://localhost:4000/api/v1/exams/${id}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        clearViews();
        renderSingleExam(id, data);
      });
  }

  function renderSingleExam(id, examInfo) {
    console.log("renderSingleExam called....");

    // Empty existing elements if any
    singleExamContainer.innerHTML = " ";
    examRow.innerHTML = " ";

    singleExamContainer.style.display = "block";
    let html = `<h1>Exam ${id}</h1> <input type="text" placeholder="Search...." id="search"></input>
                  <table>
                      <tr>
                        <th>Student Name</th>
                        <th>Grade</th>
                        <th>Rank</th>
                      </tr>
                  </table>`;

    // Call Rank Method in order to Rank Scores
    getRank(examInfo);

    //Render header Info
    singleExamContainer.innerHTML += html;

    // Iterate through updated obj with rank info
    examInfo.results.forEach(exam => {
      let rows = `<tr>
          <td>${exam.studentId}</td><td>${exam.score}</td><td>${exam.rank}</td>
        </tr>`;
      examRow.innerHTML += rows;
    });
    singleExamContainer.appendChild(examRow);

    searchExam();
  }

  function searchExam() {
    console.log("searchExam called .....");
    let search = document.querySelector("#search");
    let nodes = examRow.children;
    search.addEventListener("blur", function() {
      for (let i = 0; i < nodes.length; i++) {
        let student = nodes[i].children[0].children[0];
        if (student.innerText.indexOf(search.value) > -1) {
          student.parentNode.parentNode.style.display = "block";
        } else {
          student.parentNode.parentNode.style.display = "none";
        }
      }
    });
  }

  function renderStudents(studentInfo) {
    console.log("renderStudents called....");

    clearViews();
    studContainer.style.display = "block";
    studentRow.innerHTML = " ";

    //If no students have been populated let the user know
    if (studentInfo.length === 0) {
      html = `<tr>
          <td>No students yet</td>
        </tr>`;
      studentRow.innerHTML += html;
    } else {
      let html = ` `;
      studentInfo.forEach(student => {
        html = `<tr class="getStudentInfo" id="${student}">
              <td>Student ${student}</td>
            </tr>`;
        studentRow.innerHTML += html;
      });
    }
    getStudent();
  }

  function getStudent(id) {
    console.log("getStudent called....");

    // Adding listeners for rows
    let classInfoBtn = document.querySelectorAll(".getStudentInfo");
    classInfoBtn.forEach(btn => {
      btn.addEventListener("click", function(e) {
        // get id from <tr>
        getStudentApi(e.path[1].id);
      });
    });
  }

  function getStudentApi(id) {
    console.log("getStudentApi called...." + id);

    // Get data for single student
    fetch(`http://localhost:4000/api/v1/students/${id}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        clearViews();
        renderStudentExam(id, data);
      });
  }

  function renderStudentExam(name, studentInfo) {
    console.log("renderStudentExam called....");

    // Empty existing elements if any
    singleStudContainer.innerHTML = " ";
    examRow.innerHTML = " ";
    singleStudContainer.style.display = "block";
    let html = `
    <h1>${name} | Average ${studentInfo.average}</h1>
    <table>
        <tr>
          <th>Exam</th>
          <th>Score</th>
        </tr>
    </table>`;

    // Render header Info
    singleStudContainer.innerHTML += html;
    // Iterate through exam keys
    Object.keys(studentInfo.examResults).forEach(key => {
      let rows = `<tr>
          <td>Exam (${key})</td><td>Score: ${
        studentInfo.examResults[key].score
      } </td>
        </tr>`;
      examRow.innerHTML += rows;
    });
    singleStudContainer.appendChild(examRow);
  }

  function getApi(e) {
    console.log("getApi called....");

    // Fetch API based on button ID ie: students or exams
    fetch(`http://localhost:4000/api/v1/${e.target.id}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (e.target.id === "students") {
          renderStudents(data);
        }
        if (e.target.id === "exams") {
          renderExams(data);
        }
      });
  }

  // Adding listeners to main buttons
  btnExam.addEventListener("click", e => {
    getApi(e);
  });

  btnStud.addEventListener("click", e => {
    getApi(e);
  });
})();
