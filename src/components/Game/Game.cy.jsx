import Game from './Game';

describe('<Game />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Game />);
  });
});
