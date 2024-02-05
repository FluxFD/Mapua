// quizService.js

import axios from "axios";

export const createQuiz = (newQuizName) => {
  const formData = new FormData();
  formData.append("quiz_name", newQuizName);
  formData.append("status", "Active");

  return axios.post("http://localhost/learn/URL_CREATE_QUIZ.php", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editQuiz = (quizId, newQuizName) => {
  const formData = new FormData();
  formData.append("quiz_id", quizId);
  formData.append("quiz_name", newQuizName);
  formData.append("status", "Active");

  return axios.post("http://localhost/learn/URL_EDIT_QUIZ.php", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteQuiz = (quizId) => {
  const formData = new FormData();
  formData.append("quiz_id", quizId);
  formData.append("status", "Active");

  return axios.post("http://localhost/learn/URL_DELETE_QUIZ.php", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchQuizzes = (newQuizName) => {
  return fetch(`http://localhost/learn/URL_QUIZ.php?quizName=${newQuizName}`)
    .then((response) => response.json())
    .then((data) => data.data || [])
    .catch((error) => {
      console.error("Error fetching data:", error);
      return [];
    });
};
