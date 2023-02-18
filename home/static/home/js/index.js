$(document).ready(function(){
    $(".view-more").click(function() {
        $(this).siblings().show();
        $(this).hide();
        console.log($(this).parents(".col-6").width())
        if($(this).parents(".col-6").width() < 250) {
            $(this).parents(".col-6").addClass("full-width").removeClass("normal-width");
            $(this).parents(".col-6").siblings().hide();
        }
        $(this).parents(".row").next(".card-body").show(500);
    })
    
    $(".view-less").click(function() {
        $(this).hide();
        $(this).siblings().show();
        $(this).parents(".col-6").addClass("normal-width").removeClass("full-width")
        $(this).parents(".row").next(".card-body").hide(500);
    })
});