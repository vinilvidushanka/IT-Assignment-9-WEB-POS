function showToast(type, message) {
    $('.toast').each(function() {
        const toast = bootstrap.Toast.getInstance(this);
        if (toast) {
            toast.hide();
        }
    });
    
    const toast = (type === 'success') ? $('#success-toast') : $('#error-toast');
    toast.find('.toast-body').text(message);
    
    const bsToast = new bootstrap.Toast(toast[0], {
        animation: true,
        autohide: true,
        delay: 5000
    });
    
    bsToast.show();
}