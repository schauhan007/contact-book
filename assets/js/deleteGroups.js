$(document).on('click', '#delete-group', function(){

    const groupId = $('#delete-group-id').val();
    
    $.ajax({

        url: '/user/group/delete',
        type: 'post',
        data: {groupId},
        success: function(response){

            toastCalling(response.msg, response.flag);

            if(response.flag === 1){

                $('#exampleModal2').modal("hide");

                $('#contacts-table').find(`tbody [data-group-id="${groupId}"]`).closest('tr').remove();

            }

        },
        error: function(error){

        }

    });


})

$(document).on('click','.delete-button', function(){

    const groupId = $(this).data('group-id');

    
    const selectedOption = $('#edit-select-group').find(`option[data-group-id="${groupId}"]`);
    
    if(selectedOption.length){
        toastCalling("Group is selected", 0)
    }
    else{
        $("#delete-group-id").val(groupId);
    }

})