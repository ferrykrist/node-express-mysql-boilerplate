'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        await queryInterface.bulkInsert('modules', [
            {
                moduleId: 1,
                moduleName: 'superadmin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                moduleId: 2,
                moduleName: 'Staff',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                moduleId: 3,
                moduleName: 'User',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
        await queryInterface.bulkInsert('userModules', [
            {
                userId: 1,
                moduleId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 2,
                moduleId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                userId: 3,
                moduleId: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            }

        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('modules', null, {});
        await queryInterface.bulkDelete('userModules', null, {});
    }
};
