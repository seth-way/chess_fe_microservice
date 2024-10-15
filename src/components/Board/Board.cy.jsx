import React from 'react';
import Board from './Board';

describe('<Board />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Board />);
    cy.get('div').should('contains.text', 'Chess Board from FE Micro Service');
  });
});
