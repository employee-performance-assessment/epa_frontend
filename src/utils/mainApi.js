import checkResponse from './checkResponse.js';
import {
  ADMIN_CRITERIA,
  ADMIN_QUESTIONNAIRE_LAST,
  USERS,
  ADMIN_USERS,
  ADMIN_CRITERIA_DEFAULT,
  PROJECTS,
  ADMIN_RESET_TO_DEFAULT_QUESTIONNAIRE,
  ADMIN_PROJECTS,
  ADMIN_TASK,
} from '../constants/constantAPI.js';

function getToken() {
  return JSON.parse(localStorage.getItem('token')).token;
}

const makeAuthenticatedRequest = (url, method, body) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  return fetch(url, options).then((res) => checkResponse(res));
};

export const getUserData = () => makeAuthenticatedRequest(`${USERS}/me`, 'GET');

export const updateAdminData = (id, data) =>
  makeAuthenticatedRequest(`${ADMIN_USERS}/${id}`, 'PATCH', {
    fullName: data.fullName,
    position: data.position,
    email: data.email,
    password: data.password,
  });

export const getAllUsers = () => makeAuthenticatedRequest(ADMIN_USERS, 'GET');

export const getCurrentUser = (id) =>
  makeAuthenticatedRequest(`${USERS}/${id}`, 'GET');

export const addNewUser = ({ fullName, position, email, password }) =>
  makeAuthenticatedRequest(ADMIN_USERS, 'POST', {
    fullName,
    position,
    email,
    password,
  });

export const getAllCriterion = () =>
  makeAuthenticatedRequest(ADMIN_CRITERIA, 'GET');

export const getQuestionnaireLast = () =>
  makeAuthenticatedRequest(ADMIN_QUESTIONNAIRE_LAST, 'GET');

export const updateQuestionnaireLast = (questionnaire) =>
  makeAuthenticatedRequest(ADMIN_QUESTIONNAIRE_LAST, 'PATCH', questionnaire);

export const resetToDefaultQuestionnaire = () =>
  makeAuthenticatedRequest(ADMIN_RESET_TO_DEFAULT_QUESTIONNAIRE, 'PATCH');

export const getDefaultCriterion = () =>
  makeAuthenticatedRequest(ADMIN_CRITERIA_DEFAULT, 'GET');

export const updateUserData = ({ id, fullName, position, email, password }) => {
  const requestBody = { fullName, position, email };
  if (password) requestBody.password = password;
  return makeAuthenticatedRequest(`${ADMIN_USERS}/${id}`, 'PATCH', requestBody);
};

export const deleteUser = (id) =>
  makeAuthenticatedRequest(`${ADMIN_USERS}/${id}`, 'DELETE');

export const getProjectsName = () => makeAuthenticatedRequest(PROJECTS, 'GET');

export const setProjectsNewName = (nameProject, id) => {
  const requestBody = { nameProject };
  return makeAuthenticatedRequest(
    `${ADMIN_PROJECTS}/${id}`,
    'POST',
    requestBody
  );
};

export const setNewProjects = (nameProject) => {
  const requestBody = { name: nameProject };
  return makeAuthenticatedRequest(ADMIN_PROJECTS, 'POST', requestBody);
};

export const deleteProject = (id) =>
  makeAuthenticatedRequest(`${ADMIN_PROJECTS}/${id}`, 'DELETE');

export const getAllUserTasksByAdmin = (employeeId) => makeAuthenticatedRequest(`${ADMIN_TASK}/find?employeeId=${employeeId}`, 'GET');

export const getTaskDetailsByAdmin = (taskId) => makeAuthenticatedRequest(`${ADMIN_TASK}/${taskId}`, 'GET');