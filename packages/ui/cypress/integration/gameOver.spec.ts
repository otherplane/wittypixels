describe('GameOver', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('button', 'PLAY NOW')
  })
})
