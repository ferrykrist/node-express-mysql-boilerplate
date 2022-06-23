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

function genBreadcrumbs(data){
    let result = '';
    Object.keys(data).forEach(function(key) {
        a = data[key] =='#' ? key : '<a href="'+data[key]+'">'+key+'</a>';
        result += '<li class="breadcrumb-item">' +a+'</li>';      
    });
    return result;
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


module.exports = { ObjNotEmpty, toastr, genAlert, randBetween,genBreadcrumbs, oldInput}