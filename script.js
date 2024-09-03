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
        event.preventDefault();
        const state = { page: 'download' };
        const url = 'downloadPage.html';  // Nova URL

        // Altera a URL sem recarregar a página
        window.history.pushState(state, "", url);
    });



function loadPage(){
    var gameData = JSON.parse(localStorage.getItem("gameData"));
    const container = document.querySelector("#container");
    const row = document.createElement("div");
    row.className = "d-grid gap-2 col-6 mx-auto";
    row.style.marginBottom = "2rem"
    row.style.marginTop = "2.50rem"
    container.appendChild(row)
    const title = document.createElement("h1");
    title.textContent = gameData.name;
    title.className = "col"
    row.appendChild(title)
    const img = document.createElement("img");
    img.src = gameData.img.slice(0,gameData.img.indexOf(",") -5)
    img.className = "col d-grid gap-2 col-6 mx-auto";
    img.style.marginBottom = "2rem"
    img.style.marginTop = "2rem"
    row.appendChild(img);
    const table = document.createElement("table");
    table.innerHTML = gameData.table;
    table.className = "table table-striped col"
    const figure  = document.createElement("figure")
    figure.className = "table-striped";
    figure.appendChild(table);
    row.appendChild(figure);
    const about = document.createElement("h1")
    about.innerHTML = "About the game"
    row.appendChild(about)
    const features = document.createElement("div");
    features.textContent = gameData.features;
    features.className = "col";
    row.appendChild(features);
    const reviewtitle = document.createElement("h1")
    reviewtitle.innerHTML = "Review"
    row.appendChild(reviewtitle)
    const review = document.createElement("div");
    review.textContent = gameData.review;
    review.className = "col";
    row.appendChild(review);
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-grid gap-2 col-6 mx-auto"
    btnGroup.style.marginTop = "2.50rem"
    row.appendChild(btnGroup);
    console.log(gameData)
    for(let i = 0; i < gameData.downloadName.length -1 ; i++){
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
    console.log(url);

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

function changeTitle(t){
    const title = document.getElementById("title")
    title.textContent = t
    title.style.paddingBottom = "3rem"
    title.style.paddingTop = "3rem"
    title.style.textAlign = "center"
}


function createCards(list = []){
    const container = document.getElementById("card-container");
    container.innerHTML = "";
    
    if(list.length <= 17 &&  list.length > 0){
        changeTitle("Results")   
    }else if(list.length < 1){
        changeTitle("Cannot find any game")
    }else{
        changeTitle("Latest games")
    }
    

    list.forEach(game =>{
       const a = document.createElement("a");
       
       a.style.marginTop = "1rem";
       a.style.display = "flex"
       a.style.gap = "0rem"
       a.className = "text-decoration-none"
       const card = document.createElement("div");
       card.className = "card"
       card.style.width = "15rem";
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
        const row = document.getElementsByClassName("d-grid")
        if(row.length > 0){
            row[0].remove()
        }
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
           if(window.location.href === "http://127.0.0.1:5500/"){
                window.location.replace('downloadPage.html')
           }else{
                getLatestGames()
           }
           
        })

        
        .catch(error => {
            console.error("deu merda:", error);
        });
}




