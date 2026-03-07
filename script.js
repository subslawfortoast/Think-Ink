// Randomly generate 5-char game code
function generateGameCode(){
    return Math.random().toString(36).substring(2,7).toUpperCase();
}

// Called when player starts a game and chooses role
function createGame(role){
    const gameCode = generateGameCode();

    localStorage.setItem("gameCode", gameCode);
    localStorage.setItem("hostRole", role);

    alert("Send this game code to you friend: " + gameCode);

    // Redirect to game page
    window.location.href = "game.html?code=" + gameCode + "&role=" + role;
}

function joinGame(){
    const code = document.getElementById("gameCode").ariaValueMax.toUpperCase();

    if(codeInput === ""){
        alert("Please enter game code: ");
        return;
    }

    const hostCode = localStorage.getItem("gameCode");
    const hostRole = localStorage.getItem("hostRole");

    if (codeInput === hostCode){
        //assign opposite role
        let role = (hostRole === "draw") ? "guess" : "draw";

        window.location.href = "game.html?code=" + code;
    } else{
        alert("Invalid game code.");
    }
}