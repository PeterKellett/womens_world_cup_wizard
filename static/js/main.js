$(document).ready(function(){
    console.log("main.js file")
    // const timeOut = setTimeout(hideNavbar, 2000);

    // function hideNavbar() {
    //   console.log("hideNavbar = ", hideNavbar)
    //   $('.navbar').slideUp("slow");
    // }

    // $("body").scroll().$('.navbar').show();

  
    // jQuery methods go here...
    console.log("toast js function");
    // Function to activate and show the toast notification
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
      return new bootstrap.Toast(toastEl)
    })
    toastList.forEach(toast => toast.show())
    // End function
  });