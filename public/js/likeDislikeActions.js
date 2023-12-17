function updateLikeDislike(reviewId, action) {
    $.ajax({
        url: `/review/${action}/${reviewId}`,
        method: 'POST',
        success: function(response) {
            if(response.success) {
                $('#like-count-' + reviewId).text(response.likes);
                $('#dislike-count-' + reviewId).text(response.dislikes);
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function(error) {
            alert('Error: ' + error.responseText);
        }
    });
}

