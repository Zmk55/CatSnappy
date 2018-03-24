//problem: User when clicking on image goes to a dead end.
//solution: Create an overlay with the large image = lightbox

var $overlay = $('<div id="overlay"></div>');
//Add overlay
$("body").append($overlay);
// an image
// A caption

// Capture the click event on a link to an image
$("#photos a").click(function(event){
    event.preventDefault();
    var href = $(this).Attr("href");
    $overlay.show();

//Show the overlay
//update overlay with image linked in the link
//Get child's alt attribute and set caption

});

//When overlay is clicked
//hide the overlay

//Alert Box for Resume

