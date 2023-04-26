const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const tDepartement = sequelize.define('departement', {
    departementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    departement: DataTypes.STRING,
},
);

const vDepartement = sequelize.define('view_departement', {
    departementId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    departement: DataTypes.STRING,
    users: DataTypes.STRING,
},
);

const tUserDepartement = sequelize.define('userDepartement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    departementId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
},
    {
        indexes: [
            {
                name: 'index1',
                fields: ['departementId', 'userId']
            }]
    }
);

const vUserDepartement = sequelize.define('view_userDepartement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    departementId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    departement: DataTypes.STRING,
    fullname: DataTypes.STRING,
},
);

module.exports = {
    tDepartement, vDepartement, tUserDepartement, vUserDepartement
};