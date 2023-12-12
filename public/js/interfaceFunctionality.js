$(document).ready(function() {
    $('#dynamicContentArea').load('/feed');
    $(document).on('click', '.user-profile-link', function() {
        const user = $(this).data('userId'); // Assuming you have the user ID stored in a data attribute
        $('#dynamicContentArea').load('/path/to/user/profile/partial', { userId: userId });
    });



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

    function loadAllReviews() {
        $.ajax({
            url: '/getAllReview',
            type: 'GET',
            success: function(reviews) {
                const feedHtml = Handlebars.partials['feed']({ reviews: reviews });
                $('#reviews-container').html(feedHtml);
            },
            error: function(error) {
                console.log('Error:', error);
            }
        });
    }
    loadAllReviews();
});