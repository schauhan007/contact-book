$(document).on('click', '#update-contact', function(){

    const form = $('#edit-contact-form')[0];
    const formData = new FormData(form);    

    $.ajax({

        url: '/contact/edit',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){

            toastCalling(response.msg, response.flag);

            if(response.flag === 1){
                
                $('#exampleModal1').modal("hide");
                $('#edit-contact-form')[0].reset();

                contactList(currentPage);
            }            
        
        },
        error: function(error){
            toastCalling(error.message, 0);
        }

    });

})

$(document).on('click','.edit-button', function(){

    const contactId = $(this).data('contact-id');

    $("#update-contact-id").val(contactId);

    const thisParent = $(this).closest('tr');

    const name = thisParent.data('name')
    const email = thisParent.data('email')
    const MobileNumber	= thisParent.data('mobilenumber')
    
    $("#edit-name").val(name);
    $("#edit-email").val(email);
    $("#edit-mobile").val(MobileNumber);

    
    const groupId = thisParent.data('group-id');
    const selectedOption = $('#edit-select-group').find(`option[data-group-id="${groupId}"]`);

    if(selectedOption.length){
        $('#edit-select-group').val(selectedOption.val());
    }
    else{
        console.log("No matching option found for Group ID:", groupId);
    }
    
})