$(document).on('click', '#reset-password', function() {

    const form = $('#reset-password-form')[0];
    const formData = new FormData(form);

    const urlPath = window.location.pathname;
    console.log("urlPath--->", urlPath);

    const token = urlPath.split('/').pop();
    console.log("token--->", token);
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
            $('#reset-password').attr('disabled', false);
        },
        error: function(error) {
            console.log("error bol",error); 
        }
    });

});