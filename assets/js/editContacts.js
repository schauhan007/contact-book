$(document).on('click', '#update-contact', function(){

    const form = $('#edit-contact-form')[0];
    const formData = new FormData(form);    

    $.ajax({

        url: '/user/contact/edit',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){

            toastCalling(response.msg, response.flag);

            if(response.flag === 1){
                
                $('#exampleModal1').modal("hide");
                $('#edit-contact-form')[0].reset();

                // let toChangeTr = $(`.edit-button[data-contact-id="${response.data._id}"]`).closest('tr');

                // toChangeTr.html(`
                //     <td><img src="../../assets/images/${response.data.image}" alt="Contact Image"></td>
                //     <td>${response.data.name}</td>
                //     <td>${response.data.email}</td>
                //     <td>${response.data.MobileNumber}</td>
                //     <td>${response.data.groupId.groupName}</td>
                //     <td>
                //         <button type="button" class="edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-contact-id="${response.data._id}">Edit</button>
                //         <button type="button" class="delete-button" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-contact-id="${response.data._id}">Delete</button>
                //     </td>
                // `);

                // toChangeTr.data('name', response.data.name)
                // toChangeTr.data('email', response.data.email)
                // toChangeTr.data('mobilenumber', response.data.MobileNumber)  
                // toChangeTr.data('group-id', response.data.groupId._id);                

                // const selectedOption = $('#edit-select-group').find(`option[data-group-id="${response.data.groupId._id}"]`);

                // if(selectedOption.length){
                //     $('#edit-select-group').val(selectedOption.val());
                // }
                // else{
                //     console.log("No matching option found for Group ID:", groupId);
                // }

                contactList(currentPage);
            }            
        
        },
        error: function(error){

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