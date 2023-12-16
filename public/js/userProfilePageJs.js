$(document).ready(function() {

    $('.userProfileFull').on('click', '#followUnfollowButton', function(event) {
        // Your event handler code here
        event.preventDefault();
        var userUsername = $('#followUnfollowButton').data('user-username');
        var adminUsername = $('#followUnfollowButton').data('admin-username');
        var followState = $('#followUnfollowButton').data('follow-state');
        
        var followUnfollowUrl = followState === 'follow' ? "/addFollowerByUsername" : "/removeFollowerByUsername";
        
        $.ajax({
            url: followUnfollowUrl,
            type: 'POST',
            data: {
                userUsername: userUsername,
                adminUsername: adminUsername
            },
            success: function(response) {

                if (followState === 'follow') {
                    $('#followUnfollowButton').data('follow-state', 'unfollow');
                    $('#followUnfollowButton').text('Unfollow');
                } else {
                    $('#followUnfollowButton').data('follow-state', 'follow');
                    $('#followUnfollowButton').text('Follow');
                }
                
                populateUserProfile(userUsername,adminUsername);
                
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
                <button type="submit" id="followUnfollowButton" class="btn btn-primary"
                data-user-username="${user.username}" 
                data-admin-username="${adminUsername}" 
                data-follow-state="${user.following.includes(adminUsername) ? 'unfollow' : 'follow'}">
                ${user.following && user.following.includes(adminUsername) ? 'Unfollow' : 'Follow'} 
                </button>
                    <form>
                </div>
            </div>`;
        $('.userProfileFull').html('');
        $('.userProfileFull').html(userProfileHtml);
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