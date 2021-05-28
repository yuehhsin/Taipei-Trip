window.addEventListener("load",()=>{
    const number = decodeURIComponent(location.search).split("name=")[1]
    document.querySelector(".number").textContent=number
    fetch("/api/orders/"+number)
    .then(response=>{
        return response.json()
    }).then(data=>{
        console.log(data)
        document.querySelector(".finName").textContent=data["data"]["trip"]["attraction"]["name"]
        document.querySelector(".finDate").textContent=data["data"]["trip"]["date"]
        document.querySelector(".finPrice").textContent=data["data"]["price"]
    })
})

document.querySelector(".backHome").addEventListener("click",()=>{
    window.location.href="/"
})
