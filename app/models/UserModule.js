const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const hlp = require('../helpers/helpers');

const vUserModule = sequelize.define('view_userModules', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    userId: DataTypes.INTEGER,
    fullname: DataTypes.STRING,
    moduleId: DataTypes.INTEGER,
    moduleName: DataTypes.STRING
},
    {
        indexes: [
            {
                name: 'index1',
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
            {
                name: 'index1',
                fields: ['userId', 'moduleId']
            }],
    }
);

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
    ('moduleId' in vars) ? data.moduleId = vars.moduleId : null;
    if (hlp.ObjNotEmpty(data)) {
        console.log(data);
        return await tUserModule.destroy({ where: data });
    }
}


module.exports = { vUserModule, tUserModule, userModule_get, userModule_add, userModule_delete };


/*
Untuk mengambil data di model ada 2 cara:
1. Dengan model express
2. Dengan model query builder ala Laravel/CI

KEUNGGULAN DAN KEKURANGAN
1. Express
Pro:
- simple, langsung ke tabel
Cons:
- perubahan di nama field Tabel akan membuat semua perintah di Controller/View akan error.
- Jika diperlukan ada fungsi tambahan sebelum data dipanggil, maka harus ditambahkan juga di semua controller/views yang memanggil
-- misal: waktu menghapus user, anda perlu menghapus data user module terlebih dahulu. Jika ini dilakukan di beberapa bagian controller, anda harus menulis dua perintah.
          Ada kemungkinan anda lupa di bagian mana proses menghapus dilakukan

2. Query Builder
Pro:
- konsisten untuk proses dimanapun model dipanggil
- jika adea perubahan di nama field tabel, anda cukup mengganti di model
Cons:
- harus didefinisikan, ribet di depan, tidak praktis untuk data yang sederhana.

Contoh:
1. Express
vUserModule.findAll({raw: true, where: {userID: 123}}).then(result=> ..);

2. Query Builder
userModule_get({userId: 123}).then(result => ...);


*/
