const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Modules = sequelize.define('modules', {
    moduleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    moduleName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Modules;