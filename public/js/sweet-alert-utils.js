function showSuccessAlert(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-primary'
        }
    });
}

function showErrorAlert(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-danger'
        }
    });
}

function showWarningAlert(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'btn btn-warning'
        }
    });
}
