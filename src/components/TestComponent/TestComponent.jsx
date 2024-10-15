import './TestComponent.css';

const TestComponent = ({ msg }) => {
  return (
    <>
      <div>Test component from FE Micro Service</div>
      <p>{msg}</p>
    </>
  );
};

export default TestComponent;
