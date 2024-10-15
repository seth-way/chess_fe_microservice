import TestComponent from './TestComponent';

describe('<TestComponent />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<TestComponent />);
    cy.get('div').should(
      'contains.text',
      'Test component from FE Micro Service'
    );
  });
});
