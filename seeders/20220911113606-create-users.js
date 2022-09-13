'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('imo', 6)
    const createdAt = new Date()
    const updatedAt = createdAt

    // https://unsplash.com/photos/ZHvM3XIOHoE
    // https://unsplash.com/photos/b1Hg7QI-zcc
    // https://unsplash.com/photos/RiDxDgHg7pw

    await queryInterface.bulkInsert('users', [
      {
        username: 'Iman',
        email: 'Iman@email.com',
        password: password,
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe2RXrMYSrpFSoUNyeS9s8NvjTNNYrG0UvUblM3alZoA&s',
        createdAt,
        updatedAt,
      },
      {
        username: 'Mohamed',
        email: 'mohamed@email.com',
        password: password,
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe2RXrMYSrpFSoUNyeS9s8NvjTNNYrG0UvUblM3alZoA&s',
        createdAt,
        updatedAt,
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  },
}