$(document).ready(function() {

    $('.userProfileFull').on('click', '#followButton', function(event) {
        // Your event handler code here
        event.preventDefault();
        var userUsername = $('#followButton').data('user-username');
        var adminUsername = $('#followButton').data('admin-username');
        
        $.ajax({
            url: "/addFollowerByUsername",
            type: 'POST',
            data: {
                userUsername: userUsername,
                adminUsername: adminUsername
            },
            success: function(response) {
                location.reload()
                // populateUserProfile(userUsername,adminUsername);
                $('#followButton').hide();
                $('#unFollowButton').show();
                
            },
            error: function(error) {
                console.error("Error: ", error);
            }
        });
        
    });
    $('.userProfileFull').on('click', '#unFollowButton', function(event) {
        // Your event handler code here
        event.preventDefault();
        var userUsername = $('#unFollowButton').data('user-username');
        var adminUsername = $('#unFollowButton').data('admin-username');
        
        $.ajax({
            url: "/removeFollowerByUsername",
            type: 'POST',
            data: {
                userUsername: userUsername,
                adminUsername: adminUsername
            },
            success: function(response) {
                location.reload()
                // populateUserProfile(userUsername,adminUsername);
                $('#followButton').show();
                $('#unFollowButton').hide();
                
            },
            error: function(error) {
                console.error("Error: ", error);
            }
        });
        
    });

    function getUsernameFromCookie() {
        let username = "";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('username=')) {
                username = cookie.substring('username='.length);
                break;
            }
        }
        return username;
    }


    function boolFollower(userUsername,adminUsername) {
        if (userUsername == adminUsername){
            $('#followButton').hide();
            $('#unFollowButton').hide();
            return
        }
        $.ajax({
            url: "/checkIfFollower",
            type: 'POST',
            data: {
                userUsername: userUsername,
                adminUsername: adminUsername
            },  
            success: function(response) {
                if (response.boolVal){
                    $('#followButton').hide();
                    $('#unFollowButton').show();
                }else{
                    $('#followButton').show();
                    $('#unFollowButton').hide();
                }
            }, 
            error: function(error) {
                console.error("Error: ", error);
            }
        });
    }
    
    function formatLocation(location) {
        if (!location) return 'Location not specified';
        return `${location.firstLine || ''}, ${location.secondLine || ''}, ${location.city || ''}, ${location.state || ''}, ${location.zip || ''}, ${location.country || ''}`;
    }

    function updateUserProfileFull(user,adminUsername) {
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
                <form id="followUnfollowForm">
                <button type="submit" id="unFollowButton" class="btn btn-primary"
                data-user-username="${user.username}" 
                data-admin-username="${adminUsername}">
                Unfollow
                </button>
                <button type="submit" id="followButton" class="btn btn-primary"
                data-user-username="${user.username}" 
                data-admin-username="${adminUsername}" 
                data-follow-state="follow">
                Follow
                </button>
                    <form>
                </div>
            </div>`;
        $('.userProfileFull').html('');
        $('.userProfileFull').html(userProfileHtml);
        boolFollower(user.username,adminUsername);
    }
 
    function populateUserProfile(username,adminUsername) {
        if (userName.length > 0) {
            $.ajax({
                url: `/getUserDetails/${encodeURIComponent(username)}`,
                type: 'GET',
                success: function(userObject) {
                    updateUserProfileFull(userObject,adminUsername);
                },
                error: function(error) {
                    console.error("Error fetching user data:", error);
                }
            });
        } else {
            console.log("Username not found.");
        }}

    var userName = $('#targetUsername').text().trim();
    var adminUsername = getUsernameFromCookie();
    populateUserProfile(userName,adminUsername);

});