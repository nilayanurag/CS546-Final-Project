$(document).ready(function() {
    // Fetch and display following list
    $.ajax({
        url: '/getAllfollowing',
        type: 'GET',
        success: function(followingUsers) {
            followingUsers.forEach(function(user) {
                $('.following-list .list-group').append('<li class="list-group-item">' + user.name + '</li>');
            });
        },
        error: function(error) {
            
            console.error(error);
        }
    });
    $('#userSearchInput').on('input', async function(event) {
        event.preventDefault();
        var searchTerm = $(this).val();
        var $dropdown=$('#search-Dropdown');
        if (searchTerm.length > 0) {
            try {
                const response = await fetch(`/getUsersByPrefix?prefix=${searchTerm}`);
                const users = await response.json();
                $dropdown.html('');
                $dropdown.show();
                users.slice(0, 5).forEach(user => {
                    $('<div>').text(user.username)
                    .on('click',function(){
                        $('#userSearchInput').val(user.username);
                        $dropdown.hide();
                    }).appendTo($dropdown);
                   
                });
            } catch (error) {
                console.log('Error:', error);
            }
        } else {
            $dropdown.hide();
        }
    });

    // $('.search-suggestions').on('click', '.dropdown-item', function() {
    //     $('#userSearchInput').val($(this).text());
    // });

    // $('#goButton').click(function() {
    //     // Logic to render userDetail handlebar
    //     // Example: window.location.href = '/userDetail/' + $('#userSearchInput').val();
    // });
});