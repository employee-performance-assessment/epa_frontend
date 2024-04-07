import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import EmployeeViewCriteria from '../../components/EmployeeViewCriteria/EmployeeViewCriteria.jsx';
import SetStars from '../../components/SetStars/SetStars.js';
import styles from './EmployeeRatingPage.module.scss';
import criteria from './criteria.json';
import { getReco } from '../../utils/mainApi.js';

function EmployeeRatingPage() {
  const navigate = useNavigate();
  const { id: employeeId } = useParams();

  // Все рекомендации по ID сотрудника, до фильтрации
  const [reco, setReco] = useState([]);

  function handleClickBack() {
    navigate(-1);
  }

  useEffect(() => {
    getReco(employeeId)
      .then((res) => {
        setReco(res);
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(err);
      });
  }, []);

  return (
    <section className={styles.employeeRatingPage__container}>
      <div className={styles.employeeRatingPage__header}>
        <div className={styles.employeeRatingPage__row}>
          <button
            type="button"
            onClick={handleClickBack}
            className={styles.employeeRatingPage__back}
          >
            <div className={styles.employeeRatingPage__icon} />
            <p className={styles.employeeRatingPage__caption}>Назад </p>
          </button>
          <h2 className={styles.employeeRatingPage__title}>
            Оценки за Февраль 2024
          </h2>
        </div>
        <div className={styles.employeeRatingPage__score}>
          {/* Захардкодил рейтинг в хедере, будет приходить с бэка */}
          <SetStars
            rating="4"
            starOut={styles.employeeRatingPage__star_out}
            starIn={styles.employeeRatingPage__star_in}
          />
        </div>
      </div>
      <div className={styles.employeeRatingPage__block}>
        <div className={styles.employeeRatingPage__criteria}>
          <p />
          <h3>От руководителя</h3>
          <h3>От коллег</h3>
        </div>
        <ul className={styles.employeeRatingPage__list}>
          {/* Текст карточек пока приходит из json */}
          {criteria.map((card) => (
            <EmployeeViewCriteria
              key={card.id}
              text={card.text}
              rating={card.rating}
            />
          ))}
        </ul>

        <h3 className={styles.employeeRatingPage__recoTitle}>
          Рекомендации для сотрудника
        </h3>
        <div className={styles.employeeRatingPage__recoText}>
          <p>
            {reco}
            {/* Здравствуй, Иван. Провел оценку твоей работы за неделю, ты молодец
            все задачи сделаны, но дедлайн часто не соблюдался. <br /> 1. Не
            стесняйся просить обратную связь у коллег. Это поможет обнаружить
            области, в которых ты можешь улучшиться. <br /> 2. Работай над
            коммуникацией: Хорошая коммуникация с коллегами и клиентами играет
            ключевую роль в успешном проекте. Убедись, что четко понимаешь
            требования клиента и можешь эффективно общаться с другими
            участниками команды. <br /> 3. Изучай тенденции в дизайне: Будьте
            в курсе последних тенденций и инноваций в мире дизайна. Это
            поможет нам создавать современные и актуальные дизайн-решения.
            <br /> Удачи в работе!!! */}
          </p>
        </div>
      </div>
    </section>
  );
}

export default EmployeeRatingPage;
