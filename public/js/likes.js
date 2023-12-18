(function($) {
    let reviews = $(".review");

    if (reviews.eq(0).attr('id')) {
        // Onload, check if a review is liked. If it is, then change the icon to filled
        for (let i = 0; i < reviews.length; i++) {
            let review = reviews.eq(i)
            let id = review.attr('id');
            let requestConfig = {
                method: 'GET',
                url: `/review/addThumbsUp/${id}`,
                contentType: 'application/json',
            }
            $.ajax(requestConfig).then(function(responseMessage) {
                // Create list items for each show
                console.log(responseMessage);
                if (responseMessage.liked) {
                    let like_img = $(`#like-${id}`); // change the id according to the name of like div ----
                    like_img.attr("src", "/public/images/thumbsUp.jpg");
                }

            })
        }
    }

})(window.jQuery);
