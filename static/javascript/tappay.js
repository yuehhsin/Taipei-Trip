//初始化金鑰
TPDirect.setupSDK(20440, 'app_dsyADLd6N1ChaI32MlyCTNENL1monrO4SPdoe5dcFKDlVMHUzgfyLdEdiMxs', 'sandbox')

//植入輸入卡號表單
TPDirect.card.setup({
    fields: {
        number: {
            element: '#card-number',
            placeholder: '**** **** **** ****',
        },
        expirationDate: {
            element: '#card-expiration-date',
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'CVV'
        }
    }
})

function error_init(){
    document.querySelector(".errorInfo").style.display="none"
    document.querySelector(".errorContact").style.display="none"
}

//輸入成功取得prime編號
document.querySelector("#cashForm").addEventListener("submit",(e)=>{
    e.preventDefault()
    error_init()
    TPDirect.card.getPrime((result) => {
        const name = document.querySelector("#name")
        const email = document.querySelector("#email")
        const phone = document.querySelector("#phone")
        if (name.value==="" || email.value==="" || phone.value===""){
            document.querySelector(".errorContact").style.display="flex"
            document.querySelector(".errorMessage").textContent="聯絡資訊皆不可為空"
        }
        else{
            if (result.status !== 0) {
                //錯誤提示
                document.querySelector(".errorInfo").style.display="flex"
                let tpfield = document.querySelectorAll(".tpfield")
                for(let i=0;i<tpfield.length;i++){
                    tpfield[i].style.border="2px solid #EB5757"
                }
            }
            else{
                //成功取得prime 將資料傳給後端
                fetch("/api/orders",{
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json"
                    }),
                    body: JSON.stringify({
                        "prime": result.card.prime,
                        "orderInfo": ordering,
                        "customer": {
                            "name": name.value,
                            "email": email.value,
                            "phone": phone.value,
                        }
                    })
                }).then(response=>{
                    return response.json()
                }).then(data=>{
                    if(data["error"]){
                    }
                    else{
                        const num = data["data"]["number"]
                        window.location.href="/thankyou?name="+num
                    }

                })
            }
        }

    })
})