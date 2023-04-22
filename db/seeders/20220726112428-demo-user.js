'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [
            {
                userId: 1,
                fullname: 'admin',
                email: 'admin@mail.com',
                password: '93863810133ebebe6e4c6bbc2a6ce1e7',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 2,
                fullname: 'staff',
                email: 'staff@mail.com',
                password: '93863810133ebebe6e4c6bbc2a6ce1e7',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            ,
            {
                userId: 3,
                fullname: 'user',
                email: 'user@mail.com',
                password: '93863810133ebebe6e4c6bbc2a6ce1e7',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
