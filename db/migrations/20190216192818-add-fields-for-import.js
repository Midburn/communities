module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all ([
      queryInterface.addColumn ('Groups', 'sound_contact', {
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn ('Groups', 'dream_id', {type: Sequelize.STRING}),
      queryInterface.addColumn ('Groups', 'camp_type', {
        type: Sequelize.STRING,
      }),
      queryInterface.changeColumn ('Groups', 'group_character', {
        type: Sequelize.TEXT,
      }),
    ]);
  },
  down: (queryInterface, Sequelize) => {},
};
