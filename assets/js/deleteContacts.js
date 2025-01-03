$(document).on('click', '#delete-contact', function(){
    
    const contactId = $('#delete-contact-id').val();
    
    $.ajax({

        url: '/user/contact/delete',
        type: 'post',
        data: {contactId: contactId},
        success: function(response){

            toastCalling(response.msg, response.flag);            

            if(response.flag === 1){
                
                $('#exampleModal2').modal("hide");

                $('#contacts-table').find(`tbody [data-contact-id="${contactId}"]`).closest('tr').remove();

            }

        },
        error: function(error){

        }

    });

})

$(document).on('click','.delete-button', function(){

    const contactId = $(this).data('contact-id');

    $("#delete-contact-id").val(contactId);

})