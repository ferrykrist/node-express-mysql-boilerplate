/**
 * menghasilkan toastr alert dinamis di halaman HTML
 *
 * @param tipe object, berisi { tipe, message, title}
 * @tipe adalah warna notifikasi toastr: success, info, warning, error
 *
 */
module.exports = (param) => {
    let dialogscript = `<script> toastr["` + ('tipe' in param ? param.tipe : 'success') + `"]("` + ('message' in param ? param.message : 'Berhasil') + `", "` + ('title' in param ? param.title : 'INFO') + `") </script>`;
    console.log(dialogscript);
    return dialogscript;
}