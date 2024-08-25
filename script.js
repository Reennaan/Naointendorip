window.onload = function getLatestGames(){
    const url = "http://localhost:8080/game"
    createGameList(url);

    const input = document.getElementById("searchInput");
    input.addEventListener("keydown", function(event){
        if (event.key === "Enter") {
            event.preventDefault()
            document.getElementById("searchBtn").click();
            
        }
    });

}

function createGameList(url){
    var gameList = []
 
   fetch(url)
   .then(response =>{
    if(!response.ok){
        throw Error("deu merda")
    }
    return response.json()
   }).then(data =>{
        for(let i = 0; i< data.length; i++){
            var fixImg =  data[i].img.slice(0, data[i].img.indexOf(",") - 5)
            
            var game = {
                id: data[i].id,
                gameName: data[i].name.replace("Download",""),
                link: data[i].link,    
                img: fixImg
            }
            gameList[i] = game
        }
        createCards(gameList);
        
   })
   .catch(error =>{
    console.error("deu merda também"+error)
   })
}

function refreshPage(){
    window.location.reload();
}


function createCards(list = []){
    const container = document.getElementById("card-container");
    container.innerHTML = "";
   


    list.forEach(game =>{
       const a = document.createElement("a");
       a.href = game.link
       a.style.marginTop = "1rem";
       a.className = "text-decoration-none"
       const card = document.createElement("div");
       card.className = "card"
       card.style.width = "18rem";
       card.style.marginBottom = "1rem";
       a.appendChild(card)
       const img = document.createElement("img")
       img.src = game.img
       img.className = "card-img-top";
       
       card.appendChild(img);
       const cardBody = document.createElement("div");
       cardBody.className = "card-body";
       card.appendChild(cardBody);
       const cardTitle = document.createElement("h5");
       cardTitle.className = "card-title";
       cardTitle.textContent = game.gameName;
       cardBody.appendChild(cardTitle);
       container.appendChild(a);
    })

}


function search(game){
    
    if(!game == ""){
        const searchUrl = "http://localhost:8080/search/" + encodeURIComponent(game);
        createGameList(searchUrl);
        
    }else{
        snackbar.className = "show";
        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000); 
    }
    
}



