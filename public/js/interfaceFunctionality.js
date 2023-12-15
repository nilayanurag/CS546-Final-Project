$(document).ready(function() {
    // $('#dynamicContentArea').load('/feed');
    // $(document).on('click', '.user-profile-link', function() {
    //     const user = $(this).data('userId'); // Assuming you have the user ID stored in a data attribute
    //     $('#dynamicContentArea').load('feed', { userId: userId });
    // });

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
    
    

    $.ajax({
        url: '/getAllUsers',
        type: 'GET',
        success: function(followingUsers) {
            followingUsers.forEach(function(user) {
                $('.following-list .list-group').append('<li class="list-group-item">' + user.firstName +" "+user.lastName+ '</li>');
            });
        },
        error: function(error) {
            // Handle error
            console.error(error);
        }
    });

    $("#search-button").click(function(event) {
        event.preventDefault();
        var searchType = $("#searchTypeDropdown").text().trim();
        var searchTerm = $('#searchInput').val();
        var options = {
            option1: $('#option1').is(':checked'),
            option2: $('#option2').is(':checked')
        };
        $.ajax({
            url: "/search",
            type: "POST",
            data: {
                searchType: searchType,
                searchTerm: searchTerm,
                options: options
            },
            success: function(data) {
                console.log(data);
                const searchHtml = Handlebars.partials['search']({ searchResults: data });
                $('#search-results').html(searchHtml);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
    );

    $("#add-following-button").click(function(event) {
        event.preventDefault();
        const userId = this.getAttribute('data-user-id');
        const adminUserId = this.getAttribute('admin-user-id');
        $.ajax({
            url: "/addFollower",
            type: "POST",
            data: {
                userId: userId,
                followerId: adminUserId
            },
            success: function(data) {
                console.log(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    // function loadAllReviews() {
    //     $.ajax({
    //         url: '/getAllReviews',
    //         type: 'GET',
    //         success: function(reviews) {
    //             const feedHtml = Handlebars.partials['feed']({ reviews: reviews });
    //             $('#reviews-container').html(feedHtml);
    //         },
    //         error: function(error) {
    //             console.log('Error:', error);
    //         }
    //     });
    // }
    function getAndDisplayUserProfile(username) {
        $.ajax({
            url: `/getUserDetails/${username}`,
            type: 'GET',
            success: function(user) {
                // Assuming 'user' is the object returned from your server
                updateProfileUI(user);
            },
            error: function(error) {
                console.error('Error fetching user details:', error);
            }
        });
    }

    function getAndDisplayUserProfileFull(username) {
        $.ajax({
            url: `/getUserDetails/${username}`,
            type: 'GET',
            success: function(user) {
                // Assuming 'user' is the object returned from your server
                updateUserProfileUIFull(user);
            },
            error: function(error) {
                console.error('Error fetching user details:', error);
            }
        });
    }
    
    function updateProfileUI(user) {
        // Update the user's info
        $('.user-profile .user-info').html(`
            <div>${user.firstName} ${user.lastName}</div>
            <div>Following: ${user.following.length} | Followers: ${user.followers.length}</div>
        `);
    }
    
    function updateUserProfileFull(user) {
        var userProfileHtml = `
            <div class="row">
                <div class="col-md-4">
                    <div class="user-image-placeholder">
                        <!-- If user image is available -->
                        ${user.imageUrl ? `<img src="${user.imageUrl}" alt="${user.firstName}'s image" class="img-fluid rounded-circle">` : ''}
                    </div>
                </div>
                <div class="col-md-8">
                    <h3>${user.username}</h3>
                    <p>${user.firstName} ${user.lastName}</p>
                    <p>Sex: ${user.sex}</p>
                    <p>Age: ${user.age}</p>
                    <p>Contact: ${user.contactEmail}</p>
                    <p>Tags: ${user.tags ? user.tags.join(', ') : 'N/A'}</p>
                    <p>Location: ${formatLocation(user.location)}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <button id="followUnfollowButton" class="btn btn-primary">
                        ${user.following.includes(masterUserId) ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            </div>
        `;
    
        $('.container.userProfileFull').html(userProfileHtml);
    }
    
    function formatLocation(location) {
        if (!location) return 'Location not specified';
        return `${location.firstLine || ''}, ${location.secondLine || ''}, ${location.city || ''}, ${location.state || ''}, ${location.zip || ''}, ${location.country || ''}`;
    }
    

    function fetchReviews() {
        $.ajax({
            url: '/getAllReviews', // Your API endpoint
            type: 'GET',
            success: function(reviews) {
                reviews.forEach(function(review) {
                    var reviewHtml = createReviewHtml(review);
                    $('#reviewsFeed').append(reviewHtml);
                });
            },
            error: function(error) {
                console.log('Error fetching reviews:', error);
            }
        });
    }
    

    function createReviewHtml(review) {
        return `
            <div class="review-item mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${review.name}</h5>
                        <p class="card-text">${review.reviewText}</p>
                        <p class="card-text"><strong>Rating:</strong> ${review.rating}/5</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        ${review.image ? `<img src="${review.image}" alt="Review image" class="img-fluid">` : ''}
                        <div>
                            <input type="text" class="form-control comment-input mb-2" placeholder="Add a comment...">
                            <button class="btn btn-primary add-comment-btn mb-2" data-review-id="${review.id}">Post Comment</button>
                            <div>
                                <button class="btn btn-outline-success btn-sm mr-2 thumbs-up" data-review-id="${review.id}">
                                    <i class="fa fa-thumbs-up"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm thumbs-down" data-review-id="${review.id}">
                                    <i class="fa fa-thumbs-down"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    
    try {
        fetchReviews();
    } catch (error) {
      console.error(error);
    }
    // loadAllReviews();
    const username = getUsernameFromCookie();
    console.log('Logged in as:', username);
    getAndDisplayUserProfile(username);
    
});