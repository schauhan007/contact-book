$(document).on('click', '#register-button', function(){

    const name = $('#name').val();
    const username = $('#username').val(); 
    const email = $('#email').val(); 
    const password = $('#password').val(); 

    $.ajax({
        url: '/register',
        type: 'POST',
        data: { name, username, email, password },
        success: function(response){
            
            toastCalling(response.msg, response.flag);            

            if(response.flag === 1){
                setTimeout(() => {
                    window.location.href = '/';
                }, 1100)
            }
        },
        error: function(error){
            toastCalling(error.message, 0);
        }
    })

});


$(document).on('keypress', '#name, #username, #email, #password', function(event) {
    const registerButton = $('#register-button');

    if (event.key === 'Enter') {
        registerButton.click();
    }
    
});

$(document).on('input', '#name', function() {
    const name = $(this).val();
    const nameClass = $('.name');

    // Replace the input value with an empty string if it doesn't match the pattern
    $(this).val(name.replace(/[^A-Za-z\s]/g, '').substring(0,30));

    if(name.trim().length < 3){
        nameClass.css("color", 'red').text(`Use only alphabetic characters. Characters left: ${30 - name.length}.`);
    }
    else{
        nameClass.css("color", "green").text(`Use only alphabetic characters. Characters left: ${30 - name.length}.`);
    }

});


$(document).on('input', '#username', function() {
    const username = $(this).val();
    const usernameClass = $('.username');


    // Replace the input value with an empty string if it doesn't match the pattern
    $(this).val(username.replace(/[^a-z0-9_]/g, '').substring(0,21));

    if(username.length < 3){
        usernameClass.css("color", 'red').text(`Use only letters, numbers, and underscores. Characters left: ${20 - username.length}.`);
    }
    else{
        usernameClass.css("color", "green").text(`Use only letters, numbers, and underscores. Characters left: ${20 - username.length}.`);
    }
});


$(document).on('input', '#email', function(){
    const email = $(this).val();
    const emailClass = $('.email');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    $(this).val(email.replace(/\s/g, '').replace(/[^A-Za-z0-9.@]/g, ''));

    if(!emailPattern.test(email)){
        emailClass.css("color", 'red');
    }
    else{
        emailClass.css("color", "green");
    }

})


$(document).on('input', '#password', function(){
    const password = $(this).val();
    const passwordClass = $('.password');
    const uppercase = $('.uppercase');
    const lowercase = $('.lowercase');
    const digit = $('.digit');
    const specialCharacter = $('.special-character');

    $(this).val(password.replace(/\s/g, ''));


    if(password.length < 8){
        passwordClass.css('color', 'red');
    }
    else{
        passwordClass.css('color', 'green');
    }

    if (/[A-Z]/.test(password)) {
        uppercase.css('color', 'green').text('Uppercase letter. ✓');
    } else {
        uppercase.css('color', 'red').text('Uppercase letter. ✗');
    }

    if (/[a-z]/.test(password)) {
        lowercase.css('color', 'green').text('Lowercase letter. ✓');
    } else {
        lowercase.css('color', 'red').text('Lowercase letter. ✗');
    }

    if (/\d/.test(password)) {
        digit.css('color', 'green').text('Digit. ✓');
    } else {
        digit.css('color', 'red').text('Digit. ✗');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        specialCharacter.css('color', 'green').text('Special character. ✓');
    } else {
        specialCharacter.css('color', 'red').text('Special character. ✗');
    }

})