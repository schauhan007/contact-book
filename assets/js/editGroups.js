$(document).on('click', '#edit-group', function(){

    const form = $('#edit-group-form')[0];
    const formData = new FormData(form);
    
    $.ajax({

        url: '/group/edit',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){

            toastCalling(response.msg, response.flag);
            
            if(response.flag === 1){
                
                $('#exampleModal11').modal("hide");
                $('#edit-group-form')[0].reset();

                groupList(currentPage);

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