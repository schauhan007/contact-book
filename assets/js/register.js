$(document).on('click', '#register-button', function(){

    const name = $('#name').val();
    const username = $('#username').val(); 
    const email = $('#email').val(); 
    const password = $('#password').val(); 

    $.ajax({
        url: '/register',
        type: 'POST',
        data: { name, username, email, password },
        success: function(response){
            
            toastCalling(response.msg, response.flag);            

            if(response.flag === 1){
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1100)
            }
        },
        error: function(error){
            console.log("Error",error);
            throw error;
        }
    })

})