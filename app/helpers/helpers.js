const exec = require('child_process').exec;
const moment = require('moment');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const glob = require('glob');



//const key = crypto.randomBytes(32);
const key = 'kzntygcxywljvzvw';
let encryptor = require('simple-encryptor')(key);

function encrypt(text) {
    return encryptor.encrypt(text);
}

function decrypt(text) {
    return encryptor.decrypt(text);
}


/**
 * check apakah object tidak kosong
 */
function ObjNotEmpty(obj) {
    return Object.keys(obj).length > 0 ? true : false;
}

function isNotEmpty(value) {
    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value === 'string' && value.trim() === '') {
        return false;
    }

    if (Array.isArray(value) && value.length === 0) {
        return false;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return false;
    }

    return true;
}

function toastr(param) {
    let dialogscript = `<script> toastr["` + ('tipe' in param ? param.tipe : 'success') + `"]("` + ('message' in param ? param.message : 'Berhasil') + `", "` + ('title' in param ? param.title : 'INFO') + `") </script>`;
    return dialogscript;
}

/**
 * menghasilkan toastr alert dinamis di halaman HTML.
 *
 * @req request
 * @vars berisi tipe: error, success, warning, info, title: judul pesan, dan message: pesan apa yang ditampilkan
 *
 */
function genAlert(req, vars) {
    req.flash('alert', toastr(vars));
}


/**
 * menghasilkan nilai random antara min dan max
 */
function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * menghasilkan breadcrumb <li>
 * Input adalah seperti ini:
 * @data = { KEY: URL, KEY: URL }
 */
function genBreadcrumbs(data) {
    let result = '';
    Object.keys(data).forEach(function (key) {
        a = data[key] == '#' ? key : '<a href="' + data[key] + '">' + key + '</a>';
        result += '<li class="breadcrumb-item">' + a + '</li>';
    });
    return result;
}

/**
 * menghasilkan tanggal dan jam sekarang
 */
function now(format = 'YYYY-MM-DD HH:mm:ss') {
    moment.locale('id');
    moment.tz('Asia/Jakarta');
    return moment().format(format)
}

function tglIndo(input, format = 'ddd, DD MMM YY, HH:mm') {
    moment.locale('id');
    moment.tz('Asia/Jakarta');
    return input ? moment(input).format(format) : '';

}

function addTime(date, amount, unit, format = 'YYYY-MM-DD') {
    return moment(date).add(amount, unit).format(format);
}

function subtractTime(date, amount, unit, format = 'YYYY-MM-DD') {
    return moment(date).subtract(amount, unit).format(format);
}

function addDateTime(inputDate, timeToAdd = '00:00:00', format = 'YYYY-MM-DD HH:mm:ss') {
    moment.locale('id');
    moment.tz('Asia/Jakarta');
    const newDate = moment(inputDate).add(moment.duration(timeToAdd)).format(format);
    return newDate;
}

function compareTime(t1, t2) {
    moment.locale('id');
    moment.tz('Asia/Jakarta');
    const time1 = moment().add(moment.duration(t1));
    const time2 = moment().add(moment.duration(t2));
    const result = (time2 - time1) > 0 ? true : false;
    return result;
}

function msToTime(ms) {
    // credit to : https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days"
}

const oldInput = (req) => {
    let oldInput = req.flash('oldInput');
    if (oldInput.length > 0) {
        oldInput = oldInput[0];
    } else {
        oldInput = { name: null, email: null }
    }

    return oldInput;
}


/**
 * menghasilkan md5 dari input
 */
function md5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

function isRunningPID(pid) {
    try {
        return process.kill(pid, 0);
    } catch (error) {
        console.error(error);
        return error.code === 'EPERM';
    }
}

function isRunning(pid, appname, cb) {
    if (pid) {
        cmd = "ps ax | grep '" + appname + "' | grep " + pid + " | grep 'grep' -v";
        exec(cmd, (err, stdout, stderr) => {
            cb(stdout.toLowerCase().indexOf(appname.toLowerCase()) > -1);
        });
    } else {
        cb(false);
    }
}

function showLog(msg) {
    if (process.env.DEBUG == "TRUE") {
        console.log(msg);
    }
}

// ini helpers untuk menampilkan console.log yang sudah JSON STRINGFY, daripada tulis berkali2.
function doLog(msg) {
    console.log(JSON.stringify(msg, null, 4));
}

function createFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        showLog(`Folder '${folderPath}' created successfully.`);
    } else {
        showLog(`Folder '${folderPath}' already exists.`);
    }
}

function deleteFileFolder(path) {
    path = path.replace(/ /g, "\\ ");
    const cmd = `rm -R ${path}`
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            throw new Error('Failed to delete file/folder');
        };
    });

}



module.exports = {
    isNotEmpty, ObjNotEmpty, toastr, genAlert, randBetween, genBreadcrumbs, oldInput, now, tglIndo,
    addTime, subtractTime, addDateTime, compareTime, msToTime,
    md5, encrypt, decrypt, isRunning, isRunningPID,
    showLog, doLog, createFolder, deleteFileFolder
}