let content = document.getElementById("content");
let Page = 0;
let nextPage = 1;
let fetching = false;
let keyword_form = document.getElementById("keyword_form");
let getKeyword = document.getElementsByName("keyword");
let keyword = getKeyword[0].value;
let argsKeyword = decodeURIComponent(location.search).split("=")[1];

////// function: 連線取得資料並顯示在畫面 //////
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

                let attName = document.createElement("div"); //name
                attName.className="attName";
                let name = document.createTextNode(jsonData["data"][i]["name"]);
                attName.appendChild(name);

                let attMrt = document.createElement("div");  //mrt
                attMrt.className="attMrt";   
                let mrt = document.createTextNode(jsonData["data"][i]["mrt"]);
                attMrt.appendChild(mrt);  

                let attCategory = document.createElement("div");  //category
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
                content.appendChild(newAtt);
                
                fetching=false;
                Page=nextPage;
            }
        })
    }
}


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
















