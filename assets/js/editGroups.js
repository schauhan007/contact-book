$(document).on('click', '#edit-group', function(){

    const form = $('#edit-group-form')[0];
    const formData = new FormData(form);
    
    $.ajax({

        url: '/user/group/edit',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){

            toastCalling(response.msg, response.flag);
            
            if(response.flag === 1){
                
                $('#exampleModal11').modal("hide");
                $('#edit-group-form')[0].reset();

                let toChangeTr = $(`.edit-button[data-contact-id="${response.data._id}"]`).closest('tr');

                toChangeTr.html(`
                    <td>${response.data.groupName}</td>
                    <td>${timeAgo(response.data.createdAt)}</td>
                    <td>${timeAgo(response.data.updatedAt)}</td>
                    <td>
                        <button type="button" id="edit-button" class="edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal11" data-group-id="${response.data._id}">Edit</button>
                        <button type="button" id="delete-button" class="delete-button" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-group-id="${response.data._id}">Delete</button>
                    </td>
                `);

                toChangeTr.data('groupName', response.data.groupName);

            }

        },
        error: function(error){

        }
    });


})


$(document).on('click', '.edit-button', function(){

    const groupId = $(this).data('group-id');
    
    $('#edit-group-id').val(groupId);

    const thisParent = $(this).closest('tr');    

    const groupName = thisParent.data('group-name');

    $('#edit-groupName').val(groupName);

})