window.onload = function getLatestGames(){
    if(window.location.href === "http://127.0.0.1:5500/"){
        const url = "http://localhost:8080/game"
        createGameList(url);

        const input = document.getElementById("searchInput");
        input.addEventListener("keydown", function(event){
            if (event.key === "Enter") {
                event.preventDefault()
                document.getElementById("searchBtn").click();
                
            }
        });
    }else{
        loadPage()
        console.log("passou");
    }

   

}

 window.addEventListener('popstate', function(event) {
       window.history.go(-1);
    });


function loadPage(){
    var gameData = JSON.parse(localStorage.getItem("gameData"));
    const container = document.querySelector("#container");
    const row = document.createElement("div");
    row.className = "d-grid gap-2 col-6 mx-auto";
    container.appendChild(row)
    const title = document.createElement("h1");
    title.textContent = gameData.name;
    title.className = "col"
    row.appendChild(title)
    const img = document.createElement("img");
    img.src = gameData.img.toString();
    img.className = "col";
    row.appendChild(img);
    const table = document.createElement("div");
    table.style.backgroundColor = "white";
    table.innerHTML = gameData.table;
    table.className = "col"
    row.appendChild(table);
    const features = document.createElement("div");
    features.textContent = gameData.features;
    features.className = "col";
    row.appendChild(features);
    const review = document.createElement("div");
    review.textContent = gameData.review;
    review.className = "col";
    row.appendChild(review);
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-grid gap-2 col-6 mx-auto"
    row.appendChild(btnGroup);
    console.log(gameData)
    for(let i = 0; i < gameData.downloadName.length ; i++){
        const btn = document.createElement("button")
        btn.className = "btn btn-primary";
        btn.type = "button";
        btn.textContent = gameData.downloadName[i];
        btn.onclick = () => {
            window.open(gameData.downloadLink[i],'_blank');
        };
        btnGroup.appendChild(btn);
    }

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
    window.location.href = "http://127.0.0.1:5500/"
}


function createCards(list = []){
    const container = document.getElementById("card-container");
    container.innerHTML = "";
   


    list.forEach(game =>{
       const a = document.createElement("a");
       
       a.style.marginTop = "1rem";
       a.className = "text-decoration-none"
       //a.href = game.link
       const card = document.createElement("div");
       card.className = "card"
       card.style.width = "18rem";
       card.style.marginBottom = "1rem";
       a.appendChild(card)
       const img = document.createElement("img")
       img.src = game.img
       img.className = "card-img-top";
       img.onclick = function(){
            downloadPage(game.link)
        }
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

function downloadPage(link) {
    console.log(link);
    const url = "http://localhost:8080/download"

    const encoded = encodeURIComponent(link)

    fetch(url+`?link=${encoded}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Request failed");
            }
            return response.json();
        })
        .then(data => {
            const gameData = {
                name: data.name,
                img: data.img,
                table: data.table,
                features: data.features,
                review: data.review,
                downloadName: data.downloadName,
                downloadLink: data.downloadLink
            }

           localStorage.setItem('gameData', JSON.stringify(gameData));
           //console.log(gameData);
           //console.log(localStorage.getItem('gameData'));
           window.location.replace('downloadPage.html')
        })

        
        .catch(error => {
            console.error("deu merda:", error);
        });
}




