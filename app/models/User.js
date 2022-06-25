const bcrypt = require('bcryptjs');
const hlp = require('../helpers/helpers');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const constant = require('../../config/constant');

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
    lastLogin: DataTypes.DATE,
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
    lastLogin: {
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
    let data = {};
    if ('email' in vars) {
        // seharusnya kita pakai bcrypt, tapi kalau pakai bcrypt, kita tidak bisa tahu user mana yang belum ganti password. 
        // MD5 lebih mudah dan konsisten untuk dibandingkan daripada bcrypt kalau hanya sekedar password standard. 
        // Toh nanti pada saat user login pertama kali/setelah reset, akan diminta mengganti password.
        const findemail = tUser.findOne({ where: { email: vars.email } });
        const pass = bcrypt.hash(('password' in vars) ? vars.password : constant.MY_DEFAULTPASSWORD, 12);
        let result = await Promise.all([findemail, pass])
            .then(result => {
                if (!result[0]) {
                    ('fullname' in vars) ? data.fullname = vars.fullname : data.fullname = 'user_' + hlp.randBetween(100, 999);
                    data.password = result[1];
                    data.email = vars.email;
                    tUser.create(data);
                } 
            });
        return result;
    }
}

async function user_edit(vars) {
    let data = {};
    let vwhere = {};
    ('userId' in vars) ? vwhere.userId = vars.userId : null;
    ('fullname' in vars) ? data.fullname = vars.fullname : null;
    ('email' in vars) ? data.email = vars.email : null;
    ('password' in vars) ? data.password = vars.password : null;
    ('resetToken' in vars) ? data.resetToken = vars.resetToken : null;
    ('resetTokenExpiry' in vars) ? data.resetTokenExpiry = vars.resetTokenExpiry : null;
    if (hlp.ObjNotEmpty(vwhere)) {
         return await tUser.update(data, { where: vwhere });
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