let pathId = decodeURIComponent(location.pathname).split("/")[2]; //擷取要求字串
let imageId = 0

//render資料
function renderDots(){
    for(let i=0;1<attImage.length;i++){
        document.querySelectorAll(".dot")[i].style.backgroundColor="#FFFFFF"
        document.querySelectorAll(".dot")[imageId].style.backgroundColor="#448899"
    }
    
}
function randerData(attName,attCategory,attMrt,attDescription,attAddress,attTransport,attImage){
    document.querySelector(".attName").textContent=attName //name
    document.querySelector(".attType").textContent=attCategory+" at "+attMrt  //type
    document.querySelectorAll(".content")[0].textContent=attDescription  //description
    document.querySelectorAll(".content")[1].textContent=attAddress  //address
    document.querySelectorAll(".content")[2].textContent=attTransport  //attTransport
    document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
    for (let i=0;i<attImage.length;i++){
        let dot = document.createElement("div")
        dot.className="dot"
        dot.id=[i]
        dot.onclick=()=>{
            imageId=Number(dot.id)
            console.log(Number(dot.id)+1===attImage.length)
            document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
            if(Number(dot.id)+1===attImage.length){
                document.querySelector(".nextImageBTN").style.display="none"
            }
            else if(Number(dot.id)===0){
                document.querySelector(".backImageBTN").style.display="none"
            }
            renderDots()
        }
        document.querySelector(".imageDot").appendChild(dot)
    }
    renderDots()
}

//初始載入畫面
addEventListener("load",(e)=>{
    fetch("/api/attraction/"+pathId)
    .then((response=>{
        return response.json()
    }))
    .then((data)=>{
        attImage = data["data"]["images"]
        let attName = data["data"]["name"]
        let attCategory = data["data"]["category"]
        let attMrt = data["data"]["mrt"]
        let attDescription = data["data"]["description"]
        let attAddress = data["data"]["address"]
        let attTransport = data["data"]["transport"]
        randerData(attName,attCategory,attMrt,attDescription,attAddress,attTransport,attImage)
    })
})

//圖片切換
document.querySelector(".backImageBTN").addEventListener("click",()=>{
    document.querySelector(".nextImageBTN").style.display="block"
    if (imageId-1>=0){
        if(imageId-1===0){
            document.querySelector(".backImageBTN").style.display="none"
            imageId+=-1;
            document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
            renderDots()
        }
        imageId+=-1;
        document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
        renderDots()
    }
})

document.querySelector(".nextImageBTN").addEventListener("click",()=>{
    document.querySelector(".backImageBTN").style.display="block"
    if (imageId+1<=attImage.length){
        if(imageId+2===attImage.length){
            document.querySelector(".nextImageBTN").style.display="none"
            imageId+=1
            document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
            renderDots()
        }
        else{
            imageId+=1
            document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
            renderDots()
        }
    }
})

//radio
let timeRadio = Array.apply(null,document.querySelectorAll('[name="time"]'))
timeRadio[0].addEventListener("change",(e)=>{
    if(e.target.checked){
        document.querySelector(".price").textContent=2000
    }
})
timeRadio[1].addEventListener("change",(e)=>{
    if(e.target.checked){
        document.querySelector(".price").textContent=2500
    }
})

//tourForm
document.forms["tourForm"].addEventListener("submit",(event)=>{
    event.preventDefault();
    if(document.forms["tourForm"]["date"].value!=""){ 
        fetch("/api/booking",{
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                "attractionId": pathId,
                "date": document.forms["tourForm"]["date"].value,
                "time": document.forms["tourForm"]["time"].value,
                "price": document.querySelector(".price").textContent
            }) 
        }).then(response=>{
            return response.json()
        }).then(data=>{
            if (data["ok"]){
                window.location.href="/booking"
            }
            else if(data["error"]){
                if (data["message"]==="未登入系統，拒絕存取"){
                    document.querySelector(".dateError").style.display= "flex"
                    document.querySelector(".dateErrorText").textContent= data["message"]
                    document.querySelector(".sign-popup").style.display="block"
                    popup.signinPage()
                }
                else{
                    document.querySelector(".dateError").style.display= "flex"
                    document.querySelector(".dateErrorText").textContent= data["message"]
                }
            }
        })
    }
    else if(document.forms["tourForm"]["date"].value==""){  //日期不可為空!
        document.querySelector(".dateError").style.display= "flex"
        document.querySelector(".dateInput").style.borderColor= "#EB5757"
    }
})

//weather
const url = "https://opendata.cwb.gov.tw/fileapi/v1/rest/datastore/F-D0047-091?Authorization=CWB-8DB604AF-C47C-470D-897C-C3D4BF236A07"
fetch(url)
    .then((response) => response.json())
    .then((data) => console.log('data', data));