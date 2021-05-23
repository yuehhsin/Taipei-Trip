const signinForm = document.querySelector(".signinForm")
const signupForm = document.querySelector(".signupForm")
let popup={
    signupInit:()=>{
        document.querySelector(".signupError").style.display="none"
        document.querySelector(".signupOk").style.display="none"
        signupForm["name"].style.border="1px solid #CCCCCC"
        signupForm["email"].style.border="1px solid #CCCCCC"
        signupForm["password"].style.border="1px solid #CCCCCC"
    },    
    signinInit:()=>{
        document.querySelector(".signinError").style.display="none"
        signinForm["email"].style.border="1px solid #CCCCCC"
        signinForm["password"].style.border="1px solid #CCCCCC"
    },
    singupPage:()=>{
        popup.signupInit()
        signinForm.style.display="none"        
        signupForm.style.display="block"
        signupForm["name"].value=""
        signupForm["email"].value=""
        signupForm["password"].value=""
    },
    signinPage:()=>{
        popup.signinInit()
        signinForm.style.display="block"
        signupForm.style.display="none"
        signinForm["email"].value=""
        signinForm["password"].value=""
    }
}
//[nav]onload: 註冊/登入or登出
window.addEventListener("load",()=>{
    fetch("/api/user",{
        method:"GET"
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        let dataID = data["data"]["id"]
        memberName=data["data"]["name"]
        if (dataID===null){ //nav:註冊/登入
            document.querySelector(".placeholder").style.display="none"
            document.querySelector(".logoutBTN").style.display="none"
            document.querySelector(".signBTN").style.display="block"
        }
        else if(dataID!==null){ //nav:登出
            document.cookie = "memberName="+data["data"]["name"]
            document.querySelector(".placeholder").style.display="none"
            document.querySelector(".logoutBTN").style.display="block"
            document.querySelector(".signBTN").style.display="none"
        }
    })
})
//[nav]onclick: 註冊/登入
document.querySelector(".signBTN").addEventListener("click",()=>{
    document.querySelector(".sign-popup").style.display="block"
    popup.signinPage()
})
//[nav]登出function
document.querySelector(".logoutBTN").addEventListener("click",()=>{
    fetch("/api/user",{
        method: "DELETE"
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        document.cookie='memberName=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        if(data["ok"]){
            location.reload()
        }
    })   
})
//[nav]onclick:預定行程
document.querySelector(".tourBTN").addEventListener("click",()=>{
    console.log(document.cookie)
    if(document.cookie){ 
        window.location.href="/booking"
    }
    else{
        document.querySelector(".sign-popup").style.display="block"
        popup.signinPage()
    }
})

//[popup]登入function
signinForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    popup.signinInit()
    if (signinForm["email"].value==="" || signinForm["password"].value===""){
        document.querySelector(".signinError").style.display="flex"
        document.querySelector(".signinMessage").textContent="帳號密碼不可空"
    }
    else{
        fetch("/api/user",{
            method:"PATCH",
            headers: new Headers({ 
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
            email: signinForm["email"].value,
            password: signinForm["password"].value
            })           
        }).then(response=>{
            return response.json()
        }).then(data=>{
            if (data["ok"]){
                document.querySelector(".signinOk").style.display="flex"
                window.setTimeout(()=>{
                    location.reload()
                },1000)
            }
            else if(data["error"]){
                document.querySelector(".signinError").style.display="flex"
                document.querySelector(".signinMessage").textContent=data["message"]
            }
        })
    }
})
//[popup]註冊function
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
signupForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    popup.signupInit()
    if(signupForm["name"].value===""){
        document.querySelector(".signupError").style.display="flex"
        document.querySelector(".signupErrorText").textContent="姓名不可為空"
        signupForm["name"].style.border="2px solid #EB5757"
    }
    else if(signupForm["email"].value.search(emailRule)===-1){
        document.querySelector(".signupError").style.display="flex"
        document.querySelector(".signupErrorText").textContent="信箱格式錯誤"
        signupForm["email"].style.border="2px solid #EB5757"
    }
    else if(signupForm["password"].value.length<8){
        document.querySelector(".signupError").style.display="flex"
        document.querySelector(".signupErrorText").textContent="密碼至少8個字元"
        signupForm["password"].style.border="2px solid #EB5757"
    }
    else{
        
        fetch("/api/user",{
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({
                "name": signupForm["name"].value,
                "email": signupForm["email"].value,
                "password": signupForm["password"].value,
            })   
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            if(data["error"]){
                document.querySelector(".signupError").style.display="flex"
                document.querySelector(".signupErrorText").textContent="信箱已被註冊"
            }
            else if(data["ok"]){
                document.querySelector(".signupOk").style.display="flex"
                window.setTimeout(()=>{
                    popup.signinPage()
                },1000)
            }
        })
    }

})

//[popup]cloaseBTN關掉頁面
let closeBTN = document.querySelectorAll(".closeBTN")
for (let i=0;i<closeBTN.length;i++){
    closeBTN[i].addEventListener("click",()=>{
        document.querySelector(".sign-popup").style.display="none"
    })
}
//[popup]BG關掉頁面
document.querySelector(".grayBG").addEventListener("click",()=>{
    document.querySelector(".sign-popup").style.display="none"
})
//[popup]註冊頁面/點此登入
document.querySelector(".signinBTN").addEventListener("click",()=>{
    popup.signinPage()
})
//[popup]註冊頁面/點此註冊
document.querySelector(".signupBTN").addEventListener("click",()=>{
    popup.signupInit()
    popup.singupPage()
})










