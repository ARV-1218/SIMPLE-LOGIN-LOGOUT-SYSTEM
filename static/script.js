const user_name = document.getElementById("user_name")
const passW = document.getElementById("passW")

const submit_btn = document.getElementById("submit")
const login_btn = document.getElementById("login")

const logout_btn = document.getElementById("logout")

let url = ""


async function sendValues(flag) {
    
      if(flag == "login"){
            url ="/login"
         }else if(flag=="register"){
            url="/register"
         }
    if(user_name.value && passW.value){
        const payload ={
        "username":user_name.value,
        "password":passW.value
         }
        
       
        
    const response = await fetch(url, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), 
    })
        
        if (response.redirected){
            console.log(response)
            window.location.href = response.url
            
        }else{
            const data = await response.json()
            console.log(data)
        }   
}
}
if(logout_btn){
logout_btn.addEventListener("click",function(){
    alert("HI")
})
}


if(submit_btn)
    submit_btn.addEventListener("click",() => sendValues("register"))
if(login_btn)
    login_btn.addEventListener("click",() => sendValues("login"))

