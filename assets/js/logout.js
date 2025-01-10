$(document).on('click', '#logout-button', function(){

    $(this).attr('disabled', true); 

    $.ajax({
        url: '/logout',
        type: 'POST',
        data: {},
        success: function(response){

            toastCalling(response.msg, response.flag);                       
                        
            if(response.flag === 1){
                
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1100);
            
            }
        },
        error: function(error){
            console.log("Error",error);
            throw error;
        }
    })

})