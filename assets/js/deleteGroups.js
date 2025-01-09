$(document).on('click', '#delete-group', function(){

    const groupId = $('#delete-group-id').val();
    
    $.ajax({

        url: '/group/delete',
        type: 'post',
        data: {groupId},
        success: function(response){

            toastCalling(response.msg, response.flag);

            if(response.flag === 1){

                $('#exampleModal2').modal("hide");

                const totalRows = response.data;
                console.log("Lengthhhh", totalRows);
                
                const totalPages = Math.ceil(totalRows / limit);

                console.log("CurrentPAGE-------->", currentPage);
                console.log("totalPages-------->", totalPages);
                

                if(currentPage > totalPages){
                    currentPage = totalPages 
                }
                groupList(currentPage);

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