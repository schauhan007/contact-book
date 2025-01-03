$(document).on('click', '#add-group', function(){

    const form = $('#add-group-form')[0];
    const formData = new FormData(form); 
    $(this).attr("disabled", true);

    $.ajax({
        url: '/user/group/add',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){
            
            toastCalling(response.msg, response.flag);            
            
            if(response.flag == 1){
                
                $('#exampleModal').modal("hide");
                $('#add-group-form')[0].reset();

                $('#table-body').append(`
                    <tr data-group-name="${response.data.groupName}">
                        <td>${response.data.groupName}</td>
                        <td>${timeAgo(response.data.createdAt)}</td>
                        <td>${timeAgo(response.data.updatedAt)}</td>
                        <td>
                            <button type="button" class="edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal11" data-group-id="${response.data._id}">Edit</button>
                            <button type="button" class="delete-button" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-group-id="${response.data._id}">Delete</button>
                        </td>
                    </tr>
                `);

            }            
            
        },
        error: function(error){
            
            console.log("Error at /user/group/add post route---------------------->", error);
            
            
        }

    })

})


function groupList(){

    $.ajax({
        url: '/user/group/list',
        type: 'POST',
        data: {},
        success: function(response){
            
            $("#table-body").html(response.data);
        },
        error: function(error){

        }
    })

}

$(document).ready(function(){
    groupList()
})