(function ($) {

 

    const searchForm = $("#reviewSearchBar");
    searchForm.submit(function(event) {
        try {
            const search = $("#reviewSearchBar");
            const searchVal = search.val();
            if (!searchVal || searchVal.trim().length === 0) {
                throw "Search term must be non empty";
            }
        } catch (e) {
            event.preventDefault();
            const searchError = $("#client-error");
            searchError.html(`<p>Error: ${e}</p>`);
            searchError.addClass("form-error");
            searchError.show();
        }
    });
    
})(window.jQuery); // jQuery is exported as $ and jQuery