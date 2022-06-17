const bcrypt = require('bcryptjs');
const hlp = require('../helpers/helpers');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const vUser = sequelize.define('view_users', {
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

const tUser = sequelize.define('users', {
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

// contoh kalau mau menggunakan prinsip query builder. tapi bawaan nya sequalize sudah cukup ok. Tapi demi kesamaan dengan query builder, kita akan menggunakan prinsip ini
async function user_get(vars = null) {
    //console.log(vars);
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
    let result = await vUser.findAll(data);

    return result;
}

async function user_add(vars) {
    if (hlp.ObjNotEmpty(vars)) {
        return await tUser.create(vars);
    }
}

async function user_edit(vars) {
    let data, where = {};
    ('userId' in vars) ? where.userId = vars.userId : null;
    ('fullname' in vars) ? data.fullname = vars.fullname : null;
    ('email' in vars) ? data.email = vars.email : null;
    ('resetToken' in vars) ? data.resetToken = vars.resetToken : null;
    ('resetTokenExpiry' in vars) ? data.resetTokenExpiry = vars.resetTokenExpiry : null;
    if (hlp.ObjNotEmpty(where)) {
        return await tUser.update(data, { where: where });
    }
}

async function user_delete(vars) {
    let data = {};
    ('userId' in vars) ? data.userId = vars.userId : null;
    ('email' in vars) ? data.email = vars.email : null;
    if (hlp.ObjNotEmpty(data)) {
        return await tUser.destroy({ where: data });
    }
}

module.exports = { vUser, tUser, user_get, user_add, user_edit, user_delete };