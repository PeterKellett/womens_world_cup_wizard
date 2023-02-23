$(document).ready(function(){
    $(".view-more").click(function() {
        $(this).siblings().css('display', 'block');
        $(this).hide();
        if($(this).parents(".col-6").width() < 250) {
            $(this).parents(".col-6").addClass("full-width");
            $(this).parents(".col-6").siblings().hide();
        }
        $(this).parents(".row").next(".card-body").show(500);
    })
    
    $(".view-less").click(function() {
        $(this).hide();
        $(this).siblings().css('display', 'block');
        $(this).parents(".col-6").removeClass("full-width").siblings('.col-6').show()
        $(this).parents(".row").next(".card-body").hide(500);
    })
});