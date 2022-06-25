const { STRING } = require('sequelize');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const hlp = require('../helpers/helpers');

const vUserModule = sequelize.define('view_userModules', {
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

const tUserModule = sequelize.define('userModules', {
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

async function userModule_get(vars) {
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
    let result = await vUserModule.findAll(data);
    return result;
}

async function userModule_add(vars) {
    let data = {};
    ('userId' in vars) ? data.userId = vars.userId : null;
    ('moduleId' in vars) ? data.moduleId = vars.moduleId : null;
    if (hlp.ObjNotEmpty(data)) {
        return await tUserModule.create(data);
    }

}

async function userModule_delete(vars) {
    let data = {};
    ('id' in vars) ? data.id = vars.id : null;
    ('userId' in vars) ? data.userId = vars.userId : null;
    ('moduleId' in vars)  ? data.moduleId = vars.moduleId : null;
    if (hlp.ObjNotEmpty(data)) {
        console.log(data);
        return await tUserModule.destroy({ where: data });
    }
}


module.exports = { vUserModule, tUserModule, userModule_get, userModule_add, userModule_delete };