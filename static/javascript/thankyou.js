const searchStr = decodeURIComponent(location.search).split("&")

document.querySelector(".cardPrime").textContent=searchStr[0].replace("?","")
document.querySelector(".finName").textContent=searchStr[1]
document.querySelector(".finDate").textContent=searchStr[2]
document.querySelector(".finPrice").textContent=searchStr[3]
