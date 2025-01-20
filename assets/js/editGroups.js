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
            toastCalling(error.message, 0);
        }
    });


})


$(document).on('click', '.edit-button', function(){

    const groupId = $(this).data('group-id');
    
    $('#edit-group-id').val(groupId);

    const thisParent = $(this).closest('tr');    

    const groupName = thisParent.data('group-name');

    $('#edit-groupName').val(groupName);
    $('.edit-groupName').text(`Use only alphabetic characters.`).css("color", "black");

})

$(document).on('input', '#edit-groupName', function(){
    const groupName = $(this).val();
    const groupNameClass = $('.edit-groupName');
    const textContent = `Use only alphabetic characters. Characters left: ${30 - groupName.length}.`;


    $(this).val(groupName.replace(/[^a-zA-Z\s]/g, ''));

    if(groupName.trim().length < 3){
        groupNameClass.css("color", 'red').text(textContent);
    }
    else{
        groupNameClass.css("color", "green").text(textContent);
    }
});