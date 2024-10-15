import './Board.css';

const Board = ({ msg }) => {
  return (
    <>
      <div>Chess Board from FE Micro Service</div>
      <p>{msg}</p>
    </>
  );
};

export default Board;
