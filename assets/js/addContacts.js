let currentPage = 1;
let limit = 3;
let totalPages;
let totalRows;
let filterData = {
    filterName: "",
    filterEmail: "",
    filterMobileNumber: "",
    filterDate: "",
}

$(document).on('click', '#add-contact', function(){
    const form = $('#add-contact-form')[0];
    const formData = new FormData(form);
    $(this).attr("disabled", true);

    $.ajax({

        url: '/contact/add',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response){
            
            toastCalling(response.msg, response.flag);            

            if(response.flag == 1){
                
                $('#exampleModal').modal("hide");
                $('#add-contact-form')[0].reset();
                
                contactList(currentPage);
            }
            else{

                $('#add-contact').attr("disabled", false);
            }

        },
        error: function(error){
            toastCalling(error.message, 0);
        }
    })
    
})

function contactList(page = 1){

    const filterName = $('#filter-name').val();
    const filterEmail = $('#filter-email').val();
    const filterMobileNumber = $('#filter-mobileNumber').val();
    const filterDate = $('#filter-date').val();

    filterData = {
        filterName: filterName,
        filterEmail: filterEmail,
        filterMobileNumber: filterMobileNumber,
        filterDate: filterDate,
    }

    $.ajax({
        url: '/contact/list',
        type: 'POST',
        data: { page: page, limit: limit, filterData },
        success: function(response){

            $("#table-body").html(response.data.fileToBeRender);

            const pagination = response.data.pagination;

            $("#pagination-controls").html(`
                <button class="pagination-button" data-page="${pagination.currentPage - 1}" ${pagination.currentPage === 1 ? 'disabled' : ''}>Previous</button>
                <span>
                    Page <input type="number" id="current-page-input" value="${pagination.currentPage}" min="1" max="${pagination.totalPages}" style="width: 50px; text-align: center;" /> of ${pagination.totalPages} 
                </span>
                <span>
                    Rows per page:
                    <select id="rows-per-page" style="margin-left: 5px;">
                    </select>
                </span>
                <button class="pagination-button" data-page="${pagination.currentPage + 1}" ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}>Next</button>
                `);

                const rowsPerPageArray = [3, 6, 9, 12, 15];
                rowsPerPageArray.forEach(element => {
                    const options = $('<option></option>')
                        .val(element)
                        .text(element);
                    $('#rows-per-page').append(options);
                });

                const selectedOption = $('#rows-per-page').find(`option[value="${limit}"]`);

                if(selectedOption.length){
                    $('#rows-per-page').val(selectedOption.val());
                }
                else{
                    console.log("No matching option found for limit:", limit);
                }

                currentPage = pagination.currentPage;
                totalPages = pagination.totalPages;
                totalRows = pagination.totalData;
        
        },
        error: function(error){
            toastCalling(error.message, 0);

        }
    })

}
$(document).ready(function(){
    contactList(currentPage)
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

$(document).on('click', '.pagination-button', function () {
    const page = $(this).data('page');
    contactList(page); // Call the groupList function with the selected page
});


$(document).on('input', '#current-page-input', function(){

    const newPage = parseInt($(this).val());

    if( newPage >= 1  && newPage <= totalPages){
        currentPage = newPage;
        contactList(currentPage);
    }else {
        // Reset the input value to the current page if invalid
        $(this).val(currentPage);
        toastCalling("Invalid page number!", 0); // Optional: Display an error message
    }

})


$(document).on('change', '#rows-per-page', function () {
    const newRowsPerPage = parseInt($(this).val());

    limit = newRowsPerPage;

    totalPages = Math.ceil( totalRows / limit);
    
    if( currentPage > totalPages ){
        currentPage = totalPages;
    }
    contactList(currentPage);

});

$(document).on('input', '#filter-name', function(){
    const contact = $(this).val();

    contactList(currentPage);
});


$(document).on('input', '#filter-email', function(){
    const contact = $(this).val().trim();

    contactList(currentPage);
});


$(document).on('input', '#filter-mobileNumber', function(){
    const inputValue = $(this).val().trim();
    $(this).val(inputValue.replace(/[^0-9]/g, ''));
    contactList(currentPage);
});


$(document).on('input', '#filter-groups', function(){
    const contact = $(this).val().trim();
    
    contactList(currentPage);
});


$(document).on('input', '#filter-date', function(){
    const contact = $(this).val().trim();
    
    contactList(currentPage);
});


$(document).on('input', '#add-mobile, #edit-mobile', function(){
    
    const inputValue = $(this).val().trim();
    $(this).val(inputValue.replace(/[^0-9]/g, ''));
    
});

$(document).on('input', '#add-name', function(){

    const name = $(this).val();

    $(this).val(name.replace(/\s{2,}/g , " "));

})