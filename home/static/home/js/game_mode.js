$(document).ready(function(){
  console.log("game_mode.js file");
    // jQuery methods go here...
  var height = $('#flush-headingOne').outerHeight();
  console.log("height = " + height)
  var img = new Image();
  img.src = "https://res.cloudinary.com/dfboxofas/image/upload/v1661352995/nations-crests/worldcuptrophy_u2dh7n.jpg"
  // Image(url('https://res.cloudinary.com/dfboxofas/image/upload/v1661352995/nations-crests/worldcuptrophy_u2dh7n.jpg'));
  // img.height = 
  
  console.log("Image = "+ img)
  var image_height = $('#image').outerHeight();
  console.log("image_height = " + image_height)
  });