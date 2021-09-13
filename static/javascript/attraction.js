let pathId = decodeURIComponent(location.pathname).split("/")[2]; //擷取要求字串
let imageId = 0

function randerData(attName,attCategory,attMrt,attDescription,attAddress,attTransport,attImage){
    document.querySelector(".attName").textContent=attName //name
    document.querySelector(".attType").textContent=attCategory+" at "+attMrt  //type
    document.querySelectorAll(".content")[0].textContent=attDescription  //description
    document.querySelectorAll(".content")[1].textContent=attAddress  //address
    document.querySelectorAll(".content")[2].textContent=attTransport  //attTransport
    document.querySelector(".attImage").style.backgroundImage="url"+"("+attImage[imageId]+")"
}

let render={
    getWeather:(attAddress)=>{  //weather
        let district = attAddress.slice(5,8)
        const url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-8DB604AF-C47C-470D-897C-C3D4BF236A07&locationName="+district
        document.querySelector(".district").textContent=district
        fetch(url)
            .then(response=>{
                return response.json()
            })
            .then(data=>{
                for(let i=0;i<7;i++){
                    //天氣現象編號
                    let WxNum = Number(data["records"]["locations"][0]["location"][0]["weatherElement"][6]["time"][i*2]["elementValue"][1]["value"])
                    //最低溫度
                    let minT = data["records"]["locations"][0]["location"][0]["weatherElement"][8]["time"][i*2]["elementValue"][0]["value"]+"°"
                    //最高溫度
                    let maxT = data["records"]["locations"][0]["location"][0]["weatherElement"][12]["time"][i*2]["elementValue"][0]["value"]+"°"
                    //日期
                    let date = data["records"]["locations"][0]["location"][0]["weatherElement"][12]["time"][i*2]["startTime"].slice(5,10)
                    //濕度
                    let RH = data["records"]["locations"][0]["location"][0]["weatherElement"][2]["time"][i*2]["elementValue"][0]["value"]+"%"

                    document.querySelectorAll(".date")[i].textContent=date 
                    document.querySelectorAll(".RH")[i].textContent=RH
                    document.querySelectorAll(".T")[i].textContent=minT+" - "+maxT
                    if(WxNum===1){ //sunny
                        document.querySelectorAll(".weather_image")[i].style.backgroundImage='url("/static/icon/icon_weather_1.png")'
                    }
                    else if(1<WxNum && WxNum<4){  //sun&cloud
                        document.querySelectorAll(".weather_image")[i].style.backgroundImage='url("/static/icon/icon_weather_2.png")'
                    }  
                    else if(3<WxNum && WxNum<6){  //sun&cloud
                        document.querySelectorAll(".weather_image")[i].style.backgroundImage='url("/static/icon/icon_weather_2.5.png")'
                    }  
                    else if(19<WxNum && WxNum<23){  //午後陣雨
                        document.querySelectorAll(".weather_image")[i].style.backgroundImage='url("/static/icon/icon_weather_3.png")'
                    }
                    else if(24<WxNum && WxNum<29){  //fog
                        document.querySelectorAll(".weather_image")[i].style.backgroundImage='url("/static/icon/icon_weather_4.png")'
                    }
                    else{  //rain
                        document.querySelectorAll(".weather_image")[i].style.backgroundImage='url("/static/icon/icon_weather_5.png")'
                    }


                }
            })
            .catch(e=>{
                console.log("weather error",e)
            })
    }
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
        render.getWeather(attAddress)
    })
})

document.querySelector(".backImageBTN").addEventListener("click",()=>{
    document.querySelector(".nextImageBTN").style.display="block"
    if (imageId-1>=0){
        if(imageId-1===0){
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


//map
let map = L.map('mapid');
// 設定經緯度座標
map.setView(new L.LatLng(22.992, 120.239), 12);

// 設定圖資來源
var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16});
map.addLayer(osm);
var marker = L.marker([22.992, 120.239]).addTo(map);
marker.bindPopup("<b>22.992°<br>120.239°</b>").openPopup();
