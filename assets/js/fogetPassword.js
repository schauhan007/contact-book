$(document).on('click', '#forget-password', function() {
    

    const form = $('#forget-password-form')[0];
    const formData = new FormData(form);

    $.ajax({
        url: '/password/forgotPassword',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            
            toastCalling(response.msg, response.flag);

            if(response.flag === 1) {

                $('#toast-message').html(response.msg).css('color', response.msg == 'A password reset link has been sent successfully. Please check your email inbox.' ? 'green' : 'red');

            }
            if(response.flag === 0 && response.data.isGoogle === 1) {
                window.location.href = "/auth/error"
            }

        },
        error: function(error) {
            toastCalling(error.message, 0);
        }
    });

});


$(document).on('keypress', '#email', function(event) {
    const forgotPasswordButton = $('#forget-password');

    if (event.key === 'Enter') {
        event.preventDefault();
        forgotPasswordButton.click();
    }
    
});