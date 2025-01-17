$(document).on('click', '#login-button', function(){

    const email = $('#email').val();  
    const password = $('#password').val();
    $(this).attr('disabled', true);  

    $.ajax({
        url: '/login',
        type: 'POST',
        data: {email, password},
        success: function(response){

            toastCalling(response.msg, response.flag);
            
            if(response.flag === 1){

                $(this).attr('disabled', true);
                setTimeout(() => {
                    window.location.href = '/user/dashboard';
                }, 1100);
            
            }
            $('#login-button').attr('disabled', false);

        },
        error: function(error){    
            toastCalling(error.message, 0);
        }
    })

})

$(document).on('keypress', '#email, #password', function(event) {
    const loginButton = $('#login-button');

    if (event.key === 'Enter') {
        loginButton.click();
    }

});