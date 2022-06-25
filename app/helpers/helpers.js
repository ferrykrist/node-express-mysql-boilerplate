
const moment = require('moment');
const crypto = require('crypto'); 


/**
 * check apakah object tidak kosong
 */
function ObjNotEmpty(obj) {
    return Object.keys(obj).length > 0 ? true : false;
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
function genBreadcrumbs(data){
    let result = '';
    Object.keys(data).forEach(function(key) {
        a = data[key] =='#' ? key : '<a href="'+data[key]+'">'+key+'</a>';
        result += '<li class="breadcrumb-item">' +a+'</li>';      
    });
    return result;
}

/**
 * menghasilkan tanggal dan jam sekarang
 */
function now(){
    return moment().format('YYYY-MM-DD hh:mm:ss')
}

const oldInput = (req) => {
    let oldInput = req.flash('oldInput');
    if (oldInput.length > 0) {
        oldInput = oldInput[0];
    } else {
        oldInput = {name: null, email: null}
    }

    return oldInput;
}

/**
 * menghasilkan md5 dari input
 */
function md5(input){
    return crypto.createHash('md5').update(input).digest('hex');
}


module.exports = { ObjNotEmpty, toastr, genAlert, randBetween,genBreadcrumbs, oldInput, now, md5}