$(document).on('click', '#reset-password-button', function() {

    const form = $('#reset-password-form')[0];
    const formData = new FormData(form);

    const urlPath = window.location.pathname;

    const token = urlPath.split('/').pop();
    $(this).attr('disabled', true);
    
 
    $.ajax({
        url: `/password/resetPassword/${token}`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            
            toastCalling(response.msg, response.flag);

            if(response.flag === 1) {

                setTimeout(() => {
                    window.location.href = '/';
                }, 1100);
            }
            $('#reset-password-button').attr('disabled', false);
        },
        error: function(error) {
            toastCalling(error.message, 0);
        }
    });

});


$(document).on('keypress', '#reset-password, #verify-reset-password', function(event) {
    const resetPasswordButton = $('#reset-password-button');

    if (event.key === 'Enter') {
        resetPasswordButton.click();
    }
    
});