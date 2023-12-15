$(document).ready(function() {
    // Fetch and display following list
    // $.ajax({
    //     url: '/getAllfollowing',
    //     type: 'GET',
    //     success: function(followingUsers) {
    //         followingUsers.forEach(function(user) {
    //             $('.following-list .list-group').append('<li class="list-group-item">' + user.name + '</li>');
    //         });
    //     },
    //     error: function(error) {
            
    //         console.error(error);
    //     }
    // });
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
    $('#goButton').click(function(event) {
        event.preventDefault();
        var userName = $('#userSearchInput').val().trim();

        if (userName.length > 0) {
            $.ajax({
                url: `/getUserDetails/${encodeURI(userName)}`,
                type: 'GET',
                success: function(userObject) {
                    updateUserProfileFull(userObject);
                },
                error: function(error) {
                    console.log(error);
                }
            });

        }
        else{
            alert('Please enter a valid username');
        }
    });
 
    function formatLocation(location) {
        if (!location) return 'Location not specified';
        return `${location.firstLine || ''}, ${location.secondLine || ''}, ${location.city || ''}, ${location.state || ''}, ${location.zip || ''}, ${location.country || ''}`;
    }

    
    function updateUserProfileFull(user) {
        var userProfileHtml = `
            <div class="row">
                <div class="col-md-4">
                    <div class="user-image-placeholder">
                        ${user.imageUrl ? `<img src="${user.imageUrl}" alt="${user.firstName}'s image" class="img-fluid rounded-circle">` : ''}
                    </div>
                </div>
                <div class="col-md-8">
                    <h3>${user.username ? user.username : ''}</h3>
                    <p>${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''}</p>
                    <p>Sex: ${user.sex ? user.sex : 'N/A'}</p>
                    <p>Age: ${user.age ? user.age : 'N/A'}</p>
                    <p>Contact: ${user.contactEmail ? user.contactEmail : 'N/A'}</p>
                    <p>Location: ${user.location ? formatLocation(user.location) : 'N/A'}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    
                </div>
            </div>`;
        $('.userProfileFull').html('');
        $('.userProfileFull').html(userProfileHtml);
    }
    /**<button id="followUnfollowButton" class="btn btn-primary">
    ${user.following && user.following.includes(username) ? 'Unfollow' : 'Follow'}
    </button>***/

    // $('.search-suggestions').on('click', '.dropdown-item', function() {
    //     $('#userSearchInput').val($(this).text());
    // });

    // $('#goButton').click(function() {
    //     // Logic to render userDetail handlebar
    //     // Example: window.location.href = '/userDetail/' + $('#userSearchInput').val();
    // });
});