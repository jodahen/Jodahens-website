function saveScore(game, score){
    const best = localStorage.getItem(game+"_best") || 99999;
    if(score < best){
        localStorage.setItem(game+"_best", score);
    }
}

function getBest(game){
    return localStorage.getItem(game+"_best") || "--";
}

function registerPlay(game){
    const plays = parseInt(localStorage.getItem(game+"_plays") || 0);
    localStorage.setItem(game+"_plays", plays + 1);
}
