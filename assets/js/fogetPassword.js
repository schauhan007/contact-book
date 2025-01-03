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

                $('#toast-message').html(response.msg);

            }
        },
        error: function(error) {
            console.log("error bol",error); 
        }
    });

});