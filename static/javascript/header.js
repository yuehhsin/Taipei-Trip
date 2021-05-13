let signPOPUP = document.getElementById("signPOPUP")
let signinDialog = document.getElementById("signinDialog")
let signupDialog = document.getElementById("signupDialog")
let signBTN = document.getElementById("signBTN")
let logoutBTN = document.getElementById("logoutBTN")
let signinForm = document.getElementById("signinForm")
let signupForm = document.getElementById("signupForm")
let signError = document.getElementsByClassName("signupError")  
let signOK = document.getElementsByClassName("signOK")
let signupOK = document.getElementsByClassName("signupOK")  

let signinError = document.getElementsByClassName("signinError")  
let signPOPUP_view = {  
    signupInit:()=>{  //註冊頁init
        if (signError.length!=0 | signupOK.length!=0){ 
            document.getElementsByClassName("signupInput")[0].value=""
            document.getElementsByClassName("signupInput")[1].value=""
            document.getElementsByClassName("signupInput")[2].value=""
            signupDialog.style.height="317px"
            if (signError.length!=0){
                signupDialog.removeChild(signError[0])
            }
            else if(signupOK.length!=0){
                signupDialog.removeChild(signupOK[0])
            }
        }
    },
    signinInit:()=>{  //登入頁init
        if (signinError.length!=0){ 
            document.getElementsByClassName("signInput")[0].value=""
            document.getElementsByClassName("signInput")[1].value=""
            signinDialog.removeChild(signinError[0])
            signinDialog.style.height="260px"
            signinERROR=false
            signinSUCCESS=false
        }
    },
    signPage:()=>{  //開啟sign pop-up
        signPOPUP_view.signinInit()
        signPOPUP.style.display="block"
        signinDialog.style.display="block"
        signupDialog.style.display="none"
    },
    signinPage:()=>{  //切換登入頁
        signPOPUP_view.signinInit()
        signupError=false
        signinDialog.style.display="block"
        signupDialog.style.display="none"

    },
    signupPage:()=>{  //切換註冊頁
        signPOPUP_view.signupInit()
        signupDialog.style.display="block"
        signinDialog.style.display="none" 
    },
    closeSignPOPUP:()=>{   //關掉signPOPUP
        signPOPUP.style.display="none"
    }
}

////// sign status(onload) //////
window.addEventListener("load",()=>{
    fetch("/api/user",{
        method:"GET"
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        let dataID = data["data"]["id"]
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
let signinERROR = false
let signinSUCCESS = false

signinForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    if (signinError.length!=0){ 
        signinDialog.removeChild(signinError[0])
        signinDialog.style.height="260px"
        signinERROR=false
    }
    else if(signOK.length!=0){
        signinDialog.removeChild(signOK[0])
        signinDialog.style.height="260px"
        signinSUCCESS=false

    }
    let Email = document.forms["signinForm"]["email"].value;
    let Password = document.forms["signinForm"]["password"].value;
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
        if(jsonData["ok"]===true && signinSUCCESS===false){
            let OK = document.createElement("div")
            OK.className="signOK"
            let ok = document.createTextNode("登入成功~")  //登入成功
            OK.appendChild(ok)
            signinDialog.appendChild(OK)
            signinDialog.style.height="285px"
            signinSUCCESS=true
            function reload(){
                location.reload()
            }
            window.setTimeout(reload,1000)
        }
        else if(jsonData["error"]===true && signinERROR===false){
            let ERROR = document.createElement("div")
            ERROR.className="signinError"
            let error = document.createTextNode(jsonData["message"])
            ERROR.appendChild(error)
            signinDialog.appendChild(ERROR)
            signinDialog.style.height="285px"
            signinERROR=true
        }
    })
})

////// signup //////
signupForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let Name = document.forms["signupForm"]["name"].value;
    let Email = document.forms["signupForm"]["email"].value;
    let Password = document.forms["signupForm"]["password"].value;
    let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    if (signError.length!=0){ 
        signupDialog.removeChild(signError[0])
        signupDialog.style.height="317px"
    }
    //確定資料是否都符合格式:
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
        }).then((response)=>{
            return response.json()
        }).then((jsonData)=>{
            if(jsonData["ok"]){  //註冊成功!!!!!!
                let SUCCESS = document.createElement("div")
                SUCCESS.className="signupOK"
                let successs = document.createTextNode("註冊成功~")
                SUCCESS.appendChild(successs)
                signupDialog.appendChild(SUCCESS)
                signupDialog.style.height="345px"
                window.setTimeout(()=>{
                    signPOPUP_view.signupInit()
                    signPOPUP_view.signinPage()
                },1000)
            }
            else if(jsonData["error"]){  //信箱已被註冊
                let errormessage = jsonData["message"]
                let ERROR = document.createElement("div")
                ERROR.className="signupError"
                let error = document.createTextNode(errormessage)
                ERROR.appendChild(error)
                signupDialog.appendChild(ERROR)
                signupDialog.style.height="345px"
            }
        })
    }
})

////// signout //////
logoutBTN.addEventListener("click",()=>{
    fetch("/api/user",{
        method: "DELETE"
    })
    location.reload()
})
