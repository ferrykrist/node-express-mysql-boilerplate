function ObjNotEmpty(obj) {
    return Object.keys(obj).length > 0 ? true : false;
}
function toastr(param) {
    let dialogscript = `<script> toastr["` + ('tipe' in param ? param.tipe : 'success') + `"]("` + ('message' in param ? param.message : 'Berhasil') + `", "` + ('title' in param ? param.title : 'INFO') + `") </script>`;
    return dialogscript;
}

function genAlert(req, vars) {
    req.flash('alert', toastr(vars));
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = { ObjNotEmpty, toastr, genAlert, randBetween }