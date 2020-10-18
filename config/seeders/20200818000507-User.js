'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert({
     tableName: 'Users'
   }, [{
      firstName: 'Otávio',
      lastName: 'Paganotti',
      email: 'paganottiotavio@gmail.com',
      password: '$2a$04$MTxUHxERlZXJRG.RxdvH6uWT.T5N31q2lDGFrQcYrrvel2d54RblO',
      phone: '(67) 99646-4719',
      confirmed: true,
      active: true,
      photo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete({
      tableName: 'Users'
    }, null, {});
  }
};
