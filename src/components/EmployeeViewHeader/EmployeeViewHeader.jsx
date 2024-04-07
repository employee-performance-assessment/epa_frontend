import { useEffect, useState } from 'react';
import SetStars from '../SetStars/SetStars';
import styles from './EmployeeViewHeader.module.scss';
import { getRating, getStatPoints } from '../../utils/mainApi.js';
import { formPointsText } from '../../utils/utils';

function EmployeeViewHeader({ employee }) {
  const [rating, setRating] = useState(0);
  const [points, setPoints] = useState(0);

  const month = new Date().toLocaleString('default', { month: 'long' });

  useEffect(() => {
    if (employee.id) {
      getRating(employee.id)
        .then((res) => {
          setRating(res);
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err);
        });
    }
  }, [employee]);

  useEffect(() => {
    if (employee.id) {
      getStatPoints(employee.id)
        .then((res) => {
          setPoints(res);
        })
        .catch((err) => {
          // eslint-disable-next-line no-alert
          alert(err);
        });
    }
  }, [employee]);

  return (
    <div className={styles.employeeViewHeader__container}>
      <div className={styles.employeeViewHeader__bio}>
        <div className={styles.employeeViewHeader__image} />
        <p className={styles.employeeViewHeader__name}>{employee.fullName}</p>
        <p className={styles.employeeViewHeader__job}>
          {employee.position || 'Должность неизвестна'}
        </p>
      </div>
      <div className={styles.employeeViewHeader__rating}>
        <p>Рейтинг за {month}</p>
        <div className={styles.employeeViewHeader__stars}>
          <SetStars
            rating={rating}
            starOut={styles.employeeViewHeader__star_out}
            starIn={styles.employeeViewHeader__star_in}
          />
        </div>
      </div>
      <div className={styles.employeeViewHeader__point}>
        {points || '0'} {formPointsText(points)}
      </div>
    </div>
  );
}

export default EmployeeViewHeader;
