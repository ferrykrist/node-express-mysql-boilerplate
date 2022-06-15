const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const User = sequelize.define('view_users', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetTokenExpiry: DataTypes.DATE,
    moduleName: DataTypes.STRING,
},
    {
        indexes: [
            {
                fields: ['userId', 'email']
            }],
    });

const UserRaw = sequelize.define('users', {
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fullname: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
},
    {
        indexes: [
            // Create a unique index on email
            {
                unique: true,
                fields: ['email']
            }],
    });

async function userGet(vars = null) {
    //console.log(vars);
    // ini contoh query builder dengan sequalize
    let data = {
        raw: true,
        where: {}
    };
    ('opt_select' in vars) ? data.attributes = vars.opt_select : null;
    ('opt_groupby' in vars) ? data.group = vars.opt_groupby : null;
    ('opt_orderby' in vars) ? data.order = vars.opt_orderby : null;
    ('opt_where' in vars) ? data.where = vars.opt_where : null;

    ('userId' in vars) ? data.where.userId = vars.userId : null;
    ('email' in vars) ? data.where.email = vars.moduleId : null;
    let result = await User.findAll(data);

    return result;
}


module.exports = { User, UserRaw, userGet };