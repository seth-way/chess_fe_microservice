import TestGame from './TestGame';
import '@4tw/cypress-drag-drop';

describe('<App /> Component', () => {
  it('renders the chessboard correctly', () => {
    cy.mount(<TestGame />);
    cy.get('.game-area').should('exist');
  });

  it('recognizes game pieces', () => {
    cy.mount(<TestGame />);
    cy.get('.game-area').find('[data-square="g2"]')
  });

  it('allows the user to make a legal move', () => {
    cy.mount(<TestGame />);
    cy.get('[data-square="g2"] [data-piece="wP"]')
      .click();
    cy.get('[data-square="g3"]')
      .click();
    cy.get('[data-square="g2"] [data-piece="wP"]')
      .should('not.exist');
    cy.get('[data-square="g3"] [data-piece="wP"]')
      .should('exist');
  });
  it('prevents the user from making an illegal move', () => {
    cy.mount(<TestGame />);
    cy.get('[data-square="e2"] [data-piece="wP"]')
      .click();
    cy.get('[data-square="e5"]')
      .click();
    cy.get('[data-square="e2"] [data-piece="wP"]')
      .should('exist');
    cy.get('[data-square="e5"] [data-piece="wP"]')
      .should('not.exist');
  });
  it('allows the user to capture an enemy piece', () => {
    cy.mount(<TestGame fen="rnbqkbnr/pppppppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1" testMode={true} />);
    cy.get('[data-square="e4"] [data-piece="wP"]')
      .click();
    cy.get('[data-square="d5"]')
      .click();


    
  });
});

// implementation of the test game component kinda just had to be done
// we were unable to get our chess piece "drop" events to register using drag/drop, thus..
// we went with using click events in order to get the event to fire / register within our test
