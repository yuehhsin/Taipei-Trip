////// click singBTN(in header) //////
let signPOPUP = document.getElementById("signPOPUP")
let signinDialog = document.getElementById("signinDialog")
let signupDialog = document.getElementById("signupDialog")
let signBTN = document.getElementById("signBTN")
let logoutBTN = document.getElementById("logoutBTN")

let signinForm = document.getElementById("signinForm")
let signupForm = document.getElementById("signupForm")
let signupError = false
let signError = document.getElementsByClassName("signupError")  
let signinError = document.getElementsByClassName("signinError")  

function signPage(){   //開啟sign pop-up
    signPOPUP.style.display="block"
    signinDialog.style.display="block"
    signupDialog.style.display="none"
}
function signinPage(){  //切換登入頁
    if (signinError.length!=0){ 
        signinDialog.removeChild(signinError[0])
        signinDialog.style.height="260px"
    }
    signupError=false
    signinDialog.style.display="block"
    signupDialog.style.display="none"
}
function signupPage(){  //切換註冊頁
    if (signError.length!=0){ 
        signupDialog.removeChild(signError[0])
        signupDialog.style.height="317px"
    }
    signupDialog.style.display="block"
    signinDialog.style.display="none" 
    }
function closeSignPOP(){  //關掉sign pop-up
    signPOPUP.style.display="none"
}
function logout(){
    console.log("logout")
    fetch("api/user",{
        method: "DELETE"
    })
    location.reload()
}

////// sign status(onload) //////
window.addEventListener("load",()=>{
    fetch("/api/user",{
        method:"GET"
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        let dataID = data["data"]["id"]
        console.log(dataID)
        if (dataID===null){ //未登入=>顯示:登入註冊
            logoutBTN.style.display="none"
            signBTN.style.display="block"
        }
        else if(dataID!=null){ //已登入=>顯示:登出
            logoutBTN.style.display="block"
            signBTN.style.display="none"
        }
    })
})

////// signin //////
signinForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    let Email = document.forms["signinForm"]["email"].value;
    let Password = document.forms["signinForm"]["password"].value;
    function signinCheck(){
        fetch("/api/user",{
            method:"PATCH",
            headers: new Headers({ 
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
            email: Email,
            password: Password
            })
        }).then((response)=>{
            return response.json()
        }).then((jsonData)=>{
            console.log(jsonData)
            if(jsonData["ok"]===true && signupError===false){
                let OK = document.createElement("div")
                OK.className="signOK"
                let ok = document.createTextNode("登入成功:)")
                OK.appendChild(ok)
                signinDialog.appendChild(OK)
                signinDialog.style.height="285px"
                function reload(){
                    location.reload()
                }
                window.setTimeout(reload,1000)
                signupError=true
            }
            else if(jsonData["error"]===true && signupError===false){
                let ERROR = document.createElement("div")
                ERROR.className="signinError"
                let error = document.createTextNode(jsonData["message"])
                ERROR.appendChild(error)
                signinDialog.appendChild(ERROR)
                signinDialog.style.height="285px"
                signupError=true
            }
        })
    }
    signinCheck()
})

////// signup //////
signupForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let Name = document.forms["signupForm"]["name"].value;
    let Email = document.forms["signupForm"]["email"].value;
    let Password = document.forms["signupForm"]["password"].value;
    let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    function signupCheck(){    //確定資料是否都符合格式
        if(Name===""){
            let NAMEERROR = document.createElement("div")  //姓名不可為空
            NAMEERROR.className="signupError"
            let nameError = document.createTextNode("姓名不可為空")
            NAMEERROR.appendChild(nameError)
            signupDialog.appendChild(NAMEERROR)
            signupDialog.style.height="345px"
        }
        else if(Email.search(emailRule)===-1){  //email格式錯誤
            let EMAILERROR = document.createElement("div")
            EMAILERROR.className="signupError"
            let emailError = document.createTextNode("email格式錯誤")
            EMAILERROR.appendChild(emailError)
            signupDialog.appendChild(EMAILERROR)
            signupDialog.style.height="345px"
        }
        else if(Password.length<8){  //密碼至少8個字元
            let PASSWORDERROR = document.createElement("div")
            PASSWORDERROR.className="signupError"
            let passwordError = document.createTextNode("密碼至少8個字元")
            PASSWORDERROR.appendChild(passwordError)
            signupDialog.appendChild(PASSWORDERROR)
            signupDialog.style.height="345px"
        }
        else{
            fetch("/api/user",{
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify({
                    "name": Name,
                    "email": Email,
                    "password": Password,
                })
            })
        }
    }
    signupCheck()
})