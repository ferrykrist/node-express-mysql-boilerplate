const { STRING } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UserModule = sequelize.define('view_userModules', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    userId: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER,
    moduleName: DataTypes.STRING
},
    {
        indexes: [
            {
                fields: ['userId', 'moduleId']
            }],
    });

const UserModuleRaw = sequelize.define('userModules', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER,
},
    {
        indexes: [
            // Create a unique index on email
            {
                fields: ['userId', 'moduleId']
            }],
    });

async function userModuleGet(vars) {
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
    ('moduleId' in vars) ? data.where.moduleId = vars.moduleId : null;
    //console.log(data);
    let result = await UserModule.findAll(data);

    return result;
}

module.exports = { UserModule, UserModuleRaw, userModuleGet };