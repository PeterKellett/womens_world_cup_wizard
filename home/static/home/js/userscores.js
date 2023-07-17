MATCHES = {};
fetch('https://8000-peterkellet-womensworld-hsfyc3kn6ib.ws-eu101.gitpod.io/get_wizard_data')
.then(response => response.json())
.then(data => {
    MATCHES = data.matches;
    console.log("MATCHES = ", MATCHES);
    var hat_tricks = 0;
    MATCHES.forEach(match => {
        var home_score = $(`[data-match=${match.match_number}]`).children("div:nth-child(4)").children().text();
        var away_score = $(`[data-match=${match.match_number}]`).children("div:nth-child(5)").children().text();
        var hat_trick_index = 0;
        if(home_score != ' - ') {
            if(match.home_team_score != null) {
                if(Number(match.home_team_score) == Number(home_score)) {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(7)").append(`<i class="fa-solid fa-check hs-correct"></i>`);
                    hat_trick_index +=1;
                }
                else {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(7)").append(`<i class="fa-solid fa-xmark"></i>`)
                }
                if(match.away_team_score == Number(away_score)) {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(8)").append(`<i class="fa-solid fa-check as-correct"></i>`);
                    hat_trick_index +=1;
                }
                else {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(8)").append(`<i class="fa-solid fa-xmark"></i>`)
                }
                if(((home_score == away_score) && (match.home_team_score == match.away_team_score)) || ((home_score > away_score) && (match.home_team_score > match.away_team_score)) || ((home_score < away_score) && (match.home_team_score < match.away_team_score))) {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(9)").append(`<i class="fa-solid fa-check r-correct"></i>`);
                    hat_trick_index +=1;
                }
                else {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(9)").append(`<i class="fa-solid fa-xmark"></i>`)
                }
            } 
            if(hat_trick_index == 3) {
                hat_tricks += 1;
            }          
        }
        else {
            $(`[data-match=${match.match_number}]`).children("div:nth-child(7)").append(`<i class="fa-solid fa-xmark"></i>`);
            $(`[data-match=${match.match_number}]`).children("div:nth-child(8)").append(`<i class="fa-solid fa-xmark"></i>`);
            $(`[data-match=${match.match_number}]`).children("div:nth-child(9)").append(`<i class="fa-solid fa-xmark"></i>`);
        } 
        
    })
    var hs_total = $('.hs-correct');
    var as_total = $('.as-correct');
    var r_total = $('.r-correct'); 
    var pts_total = $('.pts');
    var pts_total_num = 0
    $.each(pts_total, function() {
        pts_total_num += Number($(this).text());
    })
    $('#hs-total').append(hs_total.length);
    $('#as-total').append(as_total.length);
    $('#r-total').append(r_total.length);
    $('#pts-total').append(pts_total_num);
    $('#hat-tricks').append(hat_tricks);
})