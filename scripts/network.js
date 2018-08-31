// for testing the offline and online status 
///it will detect connection 
//only available on google chrome and android os


function detectOffline(){
    if(navigator.onLine){
        document.documentElement.style.background = "blue";
        alert("you are offline !");

    }else{
        document.documentElement.style.backgroundColor = "yellow";
        alert("you are offline !");
    }
}

window.addEventListener["load",detectOffline];
window.addEventListener["online",detectOffline];
window.addEventListener["offline",detectOffline];