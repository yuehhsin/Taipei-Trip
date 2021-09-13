let Page = 0;
let nextPage = 1;
let fetching = false;
let keyword = document.getElementsByName("keyword")[0].value;
let argsKeyword = decodeURIComponent(location.search).split("=")[1];

function Fetch(url){
    if (fetching===false){
        fetching=true;
        fetch(url)
        .then((response)=>{ 
            return response.json();
        })
        .then((jsonData)=>{
            for (let i=0;i<12;i++){
                let newAtt = document.createElement("div"); //new div(attraction)
                newAtt.className="attraction";
                newAtt.onclick=()=>{
                    window.location.href="/attraction/"+jsonData["data"][i]["id"];
                }

                let attName = document.createElement("h6"); //name
                attName.className="attName";
                let name = document.createTextNode(jsonData["data"][i]["name"]);
                attName.appendChild(name);

                let attMrt = document.createElement("h6");  //mrt
                attMrt.className="attMrt";   
                let mrt = document.createTextNode(jsonData["data"][i]["mrt"]);
                attMrt.appendChild(mrt);  

                let attCategory = document.createElement("h6");  //category
                attCategory.className="attCategory";      
                let category = document.createTextNode(jsonData["data"][i]["category"]);
                attCategory.appendChild(category);

                let attImage = document.createElement("div");  //image
                attImage.className="attImage";  
                let image = jsonData["data"][i]["images"][0];
                attImage.style.backgroundImage="url"+"("+image+")";
                attImage.style.backgroundSize="cover";

                nextPage=jsonData["nextPage"]   //nextPage
                
                newAtt.appendChild(attName);
                newAtt.appendChild(attMrt);
                newAtt.appendChild(attCategory);
                newAtt.appendChild(attImage);
                document.getElementById("content").appendChild(newAtt);
                
                fetching=false;
                Page=nextPage;
            }
        })
    }
}

window.addEventListener("load",()=>{
    if (argsKeyword==undefined){
        //一般載入畫面
        const options = {
            root: null,
            rootMargin: "0px 0px 0px 0px",
            threshold: [1]
        }
        let fetchInfo = ()=>{
            if (Page==null){
                    observer.unobserve(target)
                    alert("已經沒有資料了喔")
                }
            else {
                Fetch("/api/attractions?page="+Page)
            }
        }
        let observer = new IntersectionObserver(fetchInfo, options);
        let target = document.getElementById("target");
        observer.observe(target);    
    }
    else{
        //關鍵字搜尋
        const options = {
            root: null,
            rootMargin: "0px 0px 0px 0px",
            threshold: [1]
        }
        let fetchInfo = ()=>{
            if (Page==null){
                observer.unobserve(target)
                alert("已經沒有資料了喔")
            }
            else{
                Fetch("/api/attractions?page="+Page+"&keyword="+argsKeyword)
            }
        }
        let observer = new IntersectionObserver(fetchInfo, options);
        let target = document.getElementById("target");
        observer.observe(target);
    }
})


// filter.BTN
document.querySelector(".filterBTNoff").addEventListener("click",()=>{
    document.querySelector(".filterBTNoff").style.display="none"
    document.querySelector(".filterBTNon").style.display="block"
    document.querySelector(".filterPOPUP").style.display="block"  
})

document.querySelector(".filterBTNon").addEventListener("click",()=>{
    document.querySelector(".filterBTNoff").style.display="block"
    document.querySelector(".filterBTNon").style.display="none"
    document.querySelector(".filterPOPUP").style.display="none"
})

document.querySelector("#theme").addEventListener("click",()=>{
    document.querySelector(".themeBox").style.display="flex"
    document.querySelector(".districtBox").style.display="none"
})
document.querySelector("#district").addEventListener("click",(e)=>{
    document.querySelector(".themeBox").style.display="none"
    document.querySelector(".districtBox").style.display="flex"
})

// goTop.BTN
document.querySelector(".toTop").addEventListener("click",()=>{
    document.documentElement.scrollTop=0
})

window.onscroll = ()=>{  //每捲動一次觸發一次
    if(document.documentElement.scrollTop>200){
        document.querySelector(".toTop").style.display="flex"
    }
    else{
        document.querySelector(".toTop").style.display="none"
    }
}

document.querySelector(".themeBox").addEventListener("click",(e)=>{
    if(e.target.dataset.tag){
        window.location.href='/?keyword='+e.target.dataset.tag;
    }
})

document.querySelector(".districtBox").addEventListener("click",(e)=>{
    if(e.target.dataset.tag){
        window.location.href='/?keyword='+e.target.dataset.tag;
    }
})
