let pathId = decodeURIComponent(location.pathname).split("/")[2];
let selAM = document.getElementById("selAM")
let selPM = document.getElementById("selPM")
let tourPrice = document.getElementById("tourPrice")
let selectedAM = false;
let selectedPM = false;
let imageId = 0;
  
function randerData(attName,attCategory,attMrt,attDescription,attAddress,attTransport){
    // document.getElementById("ID").value=pathId; //id

    let ATTname = document.getElementById("attName"); //name
    let name = document.createTextNode(attName);
    ATTname.appendChild(name);

    let ATTtype = document.getElementById("attType"); //type = actegory + mrt
    let type = document.createTextNode(attCategory+" at "+attMrt);
    ATTtype.appendChild(type);

    let ATTdes = document.getElementById("attDes"); //description
    let des = document.createTextNode(attDescription);
    ATTdes.appendChild(des);

    let ATTaddress = document.getElementById("attAddress"); //address
    let address = document.createTextNode(attAddress);
    ATTaddress.appendChild(address);

    let ATTtransport = document.getElementById("attTransport"); //transport
    let transport = document.createTextNode(attTransport);
    ATTtransport.appendChild(transport);
}
function getData(){
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
        randerData(attName,attCategory,attMrt,attDescription,attAddress,attTransport)
        renderImage(attImage)
    })
}

function renderImage(attImage){
    let ATTimage = document.getElementById("attImage");
    let image = attImage[imageId];
    ATTimage.style.backgroundImage="url"+"("+image+")";
    ATTimage.style.backgroundSize="cover";
}
function selBTN(selBTN){
    let selcted = document.createElement("div")
    selcted.id="selctedBTN"
    selBTN.appendChild(selcted)
}
function cancelBTN(selBTN){
    let selected = document.getElementById("selctedBTN")
    selBTN.removeChild(selected)
}

function backImageBTN(){
    if (imageId-1>=0){
        imageId+=-1;
    }
    renderImage(attImage)
}
function nextImageBTN(){
    console.log(imageId)
    if (imageId+1<attImage.length){
        imageId+=1;
    }
    renderImage(attImage)
}


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

//EVENT: 初始載入畫面
addEventListener("load",(e)=>{
    getData()
})



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
                    signPOPUP_view.signPage()
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