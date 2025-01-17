let currentPage = 1;
let limit = 3;
let totalPages;
let totalRows;
let filterData = {
    filterGroupName: "",
    filterDate: "",
}

$(document).on('click', '#add-group', function () {

    const form = $('#add-group-form')[0];
    const formData = new FormData(form);
    $(this).attr("disabled", true);

    $.ajax({
        url: '/group/add',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {

            toastCalling(response.msg, response.flag);

            if (response.flag == 1) {

                $('#exampleModal').modal("hide");
                $('#add-group-form')[0].reset();

                groupList(currentPage);

                $("#add-group").attr("disabled", false);

            }

            $("#add-group").attr("disabled", false);

        },
        error: function (error) {
            toastCalling(error.message, 0);
        }

    })

})



function groupList(page = 1) {

    const filterGroupName = $('#filter-groupName').val();
    const filterDate = $('#filter-create-date').val();

    filterData = {
        filterGroupName: filterGroupName,
        filterDate: filterDate,
    }


    $.ajax({
        url: '/group/list',
        type: 'POST',
        data: { page: page, limit: limit , filterData },
        success: function (response) {

            $("#table-body").html(response.data.fileToBeRender);

            // // Update pagination controls
            const pagination = response.data.pagination;
                
            $("#pagination-controls").html(`
            <button class="pagination-button" data-page="${pagination.currentPage - 1}" ${pagination.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span>
                Page <input type="number" id="current-page-input" value="${pagination.currentPage}" min="1" max="${pagination.totalPages}" style="width: 50px; text-align: center;" /> of ${pagination.totalPages} 
            </span>
            <span>
                Rows per page: 
                <select id="rows-per-page" style="margin-left: 5px;">
                    <option selected>Open this select menu</option>
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

            // Update the current page
            currentPage = pagination.currentPage;
            totalPages = pagination.totalPages;
            totalRows = pagination.totalData;

        },
        error: function (error) {
            toastCalling(error.message, 0);
        }
    })

}

$(document).ready(function () {
    groupList(currentPage);
})

$(document).on('click', '.pagination-button', function () {
    const page = $(this).data('page');
    groupList(page); // Call the groupList function with the selected page
});


$(document).on('input', '#current-page-input', function(){

    const newPage = parseInt($(this).val());

    if( newPage >= 1  && newPage <= totalPages){
        currentPage = newPage;
        groupList(currentPage);
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
    groupList(currentPage);

});



$(document).on('input', '#filter-groupName', function(){
    const contact = $(this).val().trim();

    groupList(currentPage);
});


$(document).on('input', '#filter-create-date', function(){
    const contact = $(this).val()

    groupList(currentPage);
});