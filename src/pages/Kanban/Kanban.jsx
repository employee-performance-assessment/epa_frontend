import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Boards from '../../components/Boards/Boards.jsx';
import { NotFoundTask } from '../../components/NotFoundTask/NotFoundTask.jsx';
import { NotProject } from '../../components/NotProject/NotProject.jsx';
import PopupKanban from '../../components/PopupKanban/PopupKanban.jsx';
import PopupAddNewTask from '../../components/PopupAddNewTask/PopupAddNewTask.jsx';
import PopupProject from '../../components/PopupProject/PopupProject.jsx';
import plus from '../../images/Plus.svg';
import edit from '../../images/edit-button-icon.svg';
import caretDown from '../../images/CaretDown_black.svg';
import {
  getProjectsName,
  getInfoOwnerJWT,
  getAdminTask,
  getUserTask,
} from '../../utils/mainApi.js';
import './Kanban.scss';
import InfoPopup from '../../components/InfoPopup/InfoPopup.jsx';
import { useErrorHandler } from '../../hooks/useErrorHandler.js';


function Kanban() {
  const user = useSelector((state) => state.user);
  const [isNoProject, setIsNoProject] = useState(true);
  const [isNoTask, setIsNoTask] = useState(true);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isOpenPopupAddTask, setIsOpenPopupAddTask] = useState(false);
  const [isOpenPopupProject, setIsOpenPopupProject] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTasks, setCurrentTasks] = useState([])
  const [isLoad, setIsLoad] = useState(true);
  const [currenProject, setCurrentProject] = useState('all')
  const { popupTitle, popupText, isPopupOpen, handleError, closePopup } =
    useErrorHandler();

  useEffect(() => {
    if (projects.length > 0) {
      setIsNoProject(false);
    } else {
      setIsNoProject(true);
    }
  }, [projects]);

  useEffect(() => {
    if (user) {
      setIsLoad(true);
      Promise.all([
        getProjectsName(),
        getInfoOwnerJWT(),
        user.isAdmin ? getAdminTask() : getUserTask(),
      ])
        .then((res) => {
          setProjects(res[0]);
          setTasks(res[2]);
          setCurrentTasks(res[2])
          if (res[2].length > 0) {
            setIsNoTask(false);
          }
        })
        .catch((err) => handleError(err))
        .finally(() => setIsLoad(false));
    }
  }, [user]);

  function handleClickOpenPopup() {
    setIsOpenPopup(true);
  }

  function handleClickViewAllTask() {
    getAdminTask().then((res) => {
      setTasks(res);
      setCurrentTasks(res)
      setCurrentProject('all')
    }).catch((err) => handleError(err))
  }

  function moveElementByNameToStart(array, name) {
    const index = array.findIndex(item => item.name === name);
    if (index !== -1) {
      // Перемещаем элемент в начало массива
      array.splice(0, 0, array.splice(index, 1)[0]);
    }
  }

  function handleClickProject(project) {
    setCurrentProject(project.name)
    setCurrentTasks(tasks.filter((item) => item.project.id === project.id))
    const arrProject = projects.map(i => i)
    moveElementByNameToStart(arrProject, project.name);
    console.log(arrProject)
    setProjects(arrProject)
  }

  return user ? (
    <section className="kanban_page">
      <div className="kanban__main">
        <nav className="kanban__nav">
          <div className="kanban__container-project">
            <p className="kanban__label">Проект:</p>
            {console.log(projects)}
            {projects[0] && (
              <button
                type="button"
                className={`kanban__button ${currenProject === projects[0].name ? 'kanban__button_border' : 'kanban__button_non-border'}`}
                onClick={() => handleClickProject(projects[0])}
              >
                <p className="kanban__button-title">{projects[0].name} </p>
              </button>
            )}
            {projects[1] && (
              <button
                type="button"
                className={`kanban__button ${currenProject === projects[1].name ? 'kanban__button_border' : 'kanban__button_non-border'}`}
                onClick={() => handleClickProject(projects[1])}
              >
                <p className="kanban__button-title">{projects[1].name} </p>
              </button>
            )}
            <button
              type="button"
              className="kanban__button kanban__button_more"
              onClick={() => {
                setIsOpenPopupProject(true);
              }}
            >
              <p className="kanban__button-title">
                ...ещё {projects.length > 2 && projects.length - 2}
              </p>
              <img src={caretDown} alt="Раскрыть список проектов" />
            </button>
            {isOpenPopupProject && (
              <PopupProject
                projects={projects}
                setIsOpenPopupProject={setIsOpenPopupProject}
                handleClickProject={handleClickProject}
              />
            )}
          </div>
          <div className="kanban__container-project">
            {!isLoad && user.isAdmin ? (
              <>
                <button
                  type="button"
                  className={`kanban__button ${projects.length < 1 ? 'kanban__button_grey' : currenProject === 'all' ? 'kanban__button_purple' : 'kanban__button_grey'} kanban__button_all`}
                  onClick={handleClickViewAllTask}
                  disabled={projects.length < 1}
                >
                  <p className="kanban__button-title_all">Все</p>
                </button>
                <button
                  type="button"
                  className="kanban__button kanban__button_project"
                  onClick={handleClickOpenPopup}
                >
                  <p className="kanban__button-title_make">Проекты</p>{' '}
                  <img src={edit} alt="Редактировать проект" />
                </button>
                <button
                  type="button"
                  className={`kanban__button ${projects.length < 1 ? 'kanban__button_grey' : 'kanban__button_purple'} kanban__button_task`}
                  disabled={projects.length < 1}
                  onClick={() => setIsOpenPopupAddTask(true)}
                >
                  <p className="kanban__button-title_make">Создать задачу</p>
                  <img
                    className="kanban__button-img"
                    src={plus}
                    alt="Добавить новую задачу"
                  />
                </button>
              </>
            ) : (
              <div className="kanban-header__point">0 Баллов</div>
            )}{' '}
          </div>
        </nav>
        {!isLoad && <Boards tasks={currentTasks} />}
        {isNoProject ? (
          <NotProject setProjects={setProjects} />
        ) : (
          isNoTask === true && <NotFoundTask />
        )}
      </div>
      {isOpenPopup && (
        <PopupKanban
          setIsOpenPopup={setIsOpenPopup}
          projects={projects}
          setProjects={setProjects}
        />
      )}
      {isOpenPopupAddTask && (
        <PopupAddNewTask
          setIsOpenPopup={setIsOpenPopupAddTask}
          title="Создать здачу"
          projects={projects}
          setTasks={setTasks}
          setCurrentTasks={setCurrentTasks}
        />
      )}
      {isPopupOpen && (
        <InfoPopup
          title={popupTitle}
          text={popupText}
          handleClosePopup={closePopup}
        />
      )}
    </section>
  ) : (
    ''
  );
}

export default Kanban;
