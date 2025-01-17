$(document).on('click', '#delete-contact', function(){
    
    const contactId = $('#delete-contact-id').val();
    
    $.ajax({

        url: '/contact/delete',
        type: 'post',
        data: {contactId: contactId},
        success: function(response){

            toastCalling(response.msg, response.flag);            

            if(response.flag === 1){
                
                $('#exampleModal2').modal("hide");

                const totalRows = response.data;

                const totalPages = Math.ceil(totalRows / limit);

                if(currentPage > totalPages){
                    currentPage = totalPages 
                }
                contactList(currentPage);

            }

        },
        error: function(error){
            toastCalling(error.message, 0);
        }

    });

})

$(document).on('click','.delete-button', function(){

    const contactId = $(this).data('contact-id');

    $("#delete-contact-id").val(contactId);

})