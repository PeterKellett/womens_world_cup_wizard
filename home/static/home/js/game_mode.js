$(document).ready(function(){
  console.log("game_mode.js file");
  document.querySelectorAll('input').forEach(function(item) {
    console.log("item = " + item.value)
    if (item.value == "") {
      item.required = true;
    }
  })
  });