window.addEventListener("load",()=>{
    fetch("/api/booking")
    .then(response=>{
        return response.json()
    })
    .then(data=>{
        document.querySelector(".memberName").textContent=document.cookie.split("=")[1]
        if (data["data"]["attraction"]["id"]===null){
            document.querySelector(".tourInfo").style.display="none"
            document.querySelector(".contact").style.display="none"
            document.querySelector(".card").style.display="none"
            document.querySelector(".confirm").style.display="none"
            document.querySelector(".noTour").style.display="block"
        }
        else{ 
            document.querySelector(".tourtitle").textContent=data["data"]["attraction"]["name"]
            let tourContent = document.querySelectorAll(".tourContent")
            let Time=""
            if (data["data"]["time"]==="morning"){
                Time = "早上 9 點到下午 4 點"
            }
            else if(data["data"]["time"]==="afternoon"){
                Time = "下午 2 點到晚上 9 點"
            }
            tourContent[0].textContent=data["data"]["date"]
            tourContent[1].textContent=Time
            tourContent[2].textContent="新台幣 "+data["data"]["price"]+" 元"
            tourContent[3].textContent=data["data"]["attraction"]["address"]
            document.querySelector(".tourImage").style.backgroundImage='url('+data["data"]["attraction"]["image"]+')'
            document.querySelector(".totalPrice").textContent=data["data"]["price"]
        }
    })
})

document.querySelector(".tourDel").addEventListener("click",()=>{
    fetch("/api/booking",{
        method: "DELETE",
    })
    .then(response=>{
        return response.json()
    })
    .then(data=>{
        if(data["ok"]){
            location.reload()
        }
    })
})