let ordering={
    "att":{
        "attId": null,
        "attName": null,
        "attAddress": null,
        "attImage": null,
    },
    "date" : null,
    "time" : null,
    "price" : null
}

//載入畫面
window.addEventListener("load",()=>{
    //取得會員資料
    fetch("/api/user").then(response=>{
        return response.json()
    }).then(data=>{
        document.querySelector(".memberName").textContent=data["data"]["name"]
        document.querySelector("#name").value=data["data"]["name"]
        document.querySelector("#email").value=data["data"]["email"]
    })
    //取得景點資料
    fetch("/api/booking")
    .then(response=>{
        return response.json()
    })
    .then(data=>{
        if (data["data"]["attraction"]["id"]===null){
            document.querySelector(".tour").style.display="block"
            document.querySelector(".tourInfo").style.display="none"
            document.querySelector(".noTour").style.display="block"
        }
        else{ 
            document.querySelector(".tour").style.display="block"
            document.querySelector(".contact").style.display="block"
            document.querySelector(".card").style.display="block"
            document.querySelector(".confirm").style.display="flex"
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
            tourContent[2].textContent=data["data"]["price"]
            tourContent[3].textContent=data["data"]["attraction"]["address"]
            document.querySelector(".tourImage").style.backgroundImage='url('+data["data"]["attraction"]["image"]+')'
            document.querySelector(".totalPrice").textContent=data["data"]["price"]
            //將資料放進全域變數(Order)
            ordering={
                "att":{
                    "attId": data["data"]["attraction"]["id"],
                    "attName": data["data"]["attraction"]["name"],
                    "attAddress": data["data"]["attraction"]["address"],
                    "attImage": data["data"]["attraction"]["image"],
                },
                "date" : data["data"]["date"],
                "time" : data["data"]["time"],
                "price" : data["data"]["price"]
            }
        }
    })
})

//刪除行程
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

//test card
document.querySelector(".testcardBTN").addEventListener("click",()=>{
    console.log(document.querySelectorAll(".tpfield")[1].querySelector("#cc-exp"))
    document.querySelectorAll(".tpfield")[1].value="4242"
    // console.log(document.querySelector("#card-number-form"))
})