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

//輸入成功取得prime編號
document.querySelector("#cashForm").addEventListener("submit",(e)=>{
    e.preventDefault()
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            //錯誤提示
            console.log("error")
            document.querySelector(".errorInfo").style.display="flex"
            let tpfield = document.querySelectorAll(".tpfield")
            for(let i=0;i<tpfield.length;i++){
                tpfield[i].style.border="2px solid #EB5757"
            }
        }
        else{
            //成功取得prime 連線到/thankyou
            console.log("ok")
            const tourContent = document.querySelectorAll(".tourContent")
            const cardPrime = result.card.prime
            const finName = document.querySelector(".tourtitle").textContent
            const finDate = tourContent[0].textContent
            const finPrice = tourContent[2].textContent
            window.location.href="/thankyou?"+cardPrime+"&"+finName+"&"+finDate+"&"+finPrice
        }
    })
})