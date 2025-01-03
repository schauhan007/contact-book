$(document).on('click', '#add-contact', function(){
    const form = $('#add-contact-form')[0];
    const formData = new FormData(form);
    $(this).attr("disabled", true);

    $.ajax({

        url: '/user/contact/add',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){
            
            toastCalling(response.msg, response.flag);            

            if(response.flag == 1){
                
                $('#exampleModal').modal("hide");
                $('#add-contact-form')[0].reset();

                $('#table-body').append(`
                    <tr data-name="${response.data.name}" data-email="${response.data.email}" data-MobileNumber="${response.data.MobileNumber}" data-groupId="${response.data.groupId._id}">
                        <td><img src="../../assets/images/${response.data.image}"  width='100' height='100' style="border-radius: 50%"></td>
                        <td>${response.data.name}</td>
                        <td>${response.data.email}</td>
                        <td>${response.data.MobileNumber}</td>
                        <td>${response.data.groupId.groupName}</td>
                        <td>
                            <button type="button" class="edit-button" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-contact-id="${response.data._id}">Edit</button>
                            <button type="button"class="delete-button" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-contact-id="${response.data._id}">Delete</button>
                        </td>
                    </tr>
                `);


                const selectedOption = $('#edit-select-group').find(`option[data-group-id="${response.data.groupId._id}"]`);

                if(selectedOption.length){
                    $('#edit-select-group').val(selectedOption.val());
                }
                else{
                    console.log("No matching option found for Group ID:", groupId);
                }
                

            }
            else{

                $('#add-contact').attr("disabled", false);
            }

        },
        error: function(error){
            
            console.log("Error at /user/contact/add post route---------------------->", error);
            
        }
    })
    
})

function contactList(){

    $.ajax({
        url: '/user/contact/list',
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
    contactList()
})


$(document).on('click', '#close-modal', function(){

    
    $('#exampleModal').modal("hide");
    $('#add-contact-form')[0].reset();

})

$(document).on('click', '#add-contact-popup', function(){

    $('#add-contact').attr("disabled", false);

})


$(document).on('click','#add-select-group', function(){

    const selectedOption = $(this).find(':selected');

    if (selectedOption.val() && selectedOption.val() !== "Open this select menu") {
        console.log("An option is selected:", selectedOption.text());
        console.log("Group ID:", selectedOption.data('group-id')); // Access the data-group-id attribute
        $('#select-group').val(selectedOption.data('group-id'));
    } else {
        console.log("No valid option selected or the default option is selected.");
      }    
})