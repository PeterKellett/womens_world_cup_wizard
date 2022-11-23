console.log("userscores.js");
MATCHES = {};
fetch('https://world-cup-wizard.herokuapp.com/get_wizard_data')
.then(response => response.json())
.then(data => {
    MATCHES = data.matches;
    console.log("MATCHES = ", MATCHES);
    MATCHES.forEach(match => {
        var home_score = $(`[data-match=${match.match_number}]`).children("div:nth-child(4)").children().text();
        var away_score = $(`[data-match=${match.match_number}]`).children("div:nth-child(5)").children().text();
        if(home_score != ' - ') {
            if(match.home_team_score != null) {
                if(Number(match.home_team_score) == Number(home_score)) {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(7)").append(`<i class="fa-solid fa-check"></i>`)
                }
                else {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(7)").append(`<i class="fa-solid fa-xmark"></i>`)
                }
                if(match.away_team_score == Number(away_score)) {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(8)").append(`<i class="fa-solid fa-check"></i>`)
                }
                else {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(8)").append(`<i class="fa-solid fa-xmark"></i>`)
                }
                if(((home_score == away_score) && (match.home_team_score == match.away_team_score)) || ((home_score > away_score) && (match.home_team_score > match.away_team_score)) || ((home_score < away_score) && (match.home_team_score < match.away_team_score))) {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(9)").append(`<i class="fa-solid fa-check"></i>`)
                }
                else {
                    $(`[data-match=${match.match_number}]`).children("div:nth-child(9)").append(`<i class="fa-solid fa-xmark"></i>`)
                }
            }           
        }
        else {
            $(`[data-match=${match.match_number}]`).children("div:nth-child(7)").append(`<i class="fa-solid fa-xmark"></i>`);
            $(`[data-match=${match.match_number}]`).children("div:nth-child(8)").append(`<i class="fa-solid fa-xmark"></i>`);
            $(`[data-match=${match.match_number}]`).children("div:nth-child(9)").append(`<i class="fa-solid fa-xmark"></i>`);
        }  
    })
})