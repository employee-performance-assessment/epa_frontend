import './Board.scss';
import TimerDeadline from '../TimerDeadline/TimerDeadline.jsx';

function Board({
  setCurrentBoard,
  board,
  dropCard,
  setDropCard,
  setStartBoard,
  getNewTasks,
}) {
  // События, возникающие в перемещаемом объекте (исходный элемент):
  // ondragstart – возникает, когда пользователь начинает перемещать элемент
  // ondrag – возникает во время перемещения элемента
  // ondragend - возникает, когда пользователь заканчивает перемещать элемент

  // События, возникающие в объекте-приемнике:
  // ondragenter - возникает, когда перемещаемый элемент входит в принимающий объект
  // ondragover - возникает, когда перемещаемый элемент проходит над принимающим объектом
  // ondragleave - возникает, когда перемещаемый элемент покидает принимающий объект
  // ondrop - возникает, когда пользователь отпускает перемещаемый элемент
  function dragEndHandler(e) {
    e.currentTarget.classList.remove('boardDnD__card_OverHandler');
    e.target.classList.remove('boardDnD__card_OverHandler');
  }

  function dragOverHandler(e, board) {
    e.preventDefault();
    setCurrentBoard(board);
    e.currentTarget.classList.add('boardDnD__card_OverHandler');
  }

  function dragStartHandler(e, board, card) {
    setDropCard(card);
    setStartBoard(board);
  }

  function dropHandler(e, board) {
    console.log(e, board);
    e.preventDefault();
    getNewTasks(dropCard.id, board.status);
    e.currentTarget.classList.remove('boardDnD__card_OverHandler');
  }

  // функция сортировки применяемая для упорядочивания карт для отрисовки после перетпскивания
  const sortCard = (a, b) => a - b;

  // функция установки цвета поля баллов
  function getCollor(board) {
    if (board === 'К выполнению') {
      return 'boardDnD__card-points_yellow';
    }
    if (board === 'В работе') {
      return 'boardDnD__card-points_violet';
    }
    if (board === 'На ревью') {
      return 'boardDnD__card-points_violet';
    }
    if (board === 'Выполнено') {
      return 'boardDnD__card-points_green';
    }
    return '';
  }

  return (
    <div className="boardDnD">
      <h1 className="boardDnD__title">{board.title}</h1>
      <div
        className="boardDnD__cards"
        draggable
        onDragEnd={(e) => dragEndHandler(e)}
        onDragLeave={(e) => dragEndHandler(e)}
        onDragOver={(e) => dragOverHandler(e, board)}
        onDragStart={(e) => dragStartHandler(e, board)}
        onDrop={(e) => dropHandler(e, board)}
      >
        {/* сначала сортируем карты по порядку (order), затем перебираем массив для отрисовки карточек */}
        {board.items.sort(sortCard).map((card) => (
          <div
            className="boardDnD__card"
            draggable
            onDragEnd={(e) => dragEndHandler(e)}
            onDragLeave={(e) => dragEndHandler(e)}
            onDragOver={(e) => dragOverHandler(e, board)}
            onDragStart={(e) => dragStartHandler(e, board, card)}
            onDrop={(e) => dropHandler(e, board, card)}
            key={card.id}
          >
            <p className="boardDnD__card-number">{card.id}</p>
            <p className={`boardDnD__card-points ${getCollor(board.title)}`}>
              {card.basicPoints} баллов{' '}
            </p>
            <h3 className="boardDnD__card-title">{card.name}</h3>
            <p className="boardDnD__card-deadline">Дедлайн: {card.deadLine}</p>
            <p className="boardDnD__card-forfeit">
              Бонус/Штраф «{card.penaltyPoints}» баллов за день
            </p>
            <div className="boardDnD__card-deadline-timer">
              <TimerDeadline deadLine={card.deadLine} card={card} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
