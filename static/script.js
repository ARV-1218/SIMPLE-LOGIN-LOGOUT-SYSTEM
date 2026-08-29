const user_name = document.getElementById("user_name")
const passW = document.getElementById("passW")

const submit_btn = document.getElementById("submit")
const login_btn = document.getElementById("login")

const logout_btn = document.getElementById("logout")

const get_login = document.getElementById("get_login")
const get_register= document.getElementById("get_register")

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
        
     if (response.redirected) {
            const message = document.createElement("p");
            message.textContent = "Success! Redirecting...";
            document.body.appendChild(message);

            setTimeout(() => {
                window.location.href = response.url;
            }, 1500);
        } else {
            const data = await response.json();
            console.log(data);
        }
}
}
async function requestAuth(flag){
    
      if(flag == "login"){
            url ="/login"
         }else if(flag=="register"){
            url="/register"
         }
         try {
            const response = await fetch(url)
             console.log(response) 
             if(response.ok){
                window.location.href = `${url}`
             }
         } catch (error) {
            console.log(error)
         }
         

}

async function getUser() {
    try {
        const response = await fetch("/user_details");
        
        // If the server returns a 401 (Not logged in) or other error
        if (!response.ok) {
            const errorData = await response.json();
            console.warn("User session check failed:", errorData.message);
            return;
        }

        const data = await response.json();
        const name = document.createElement("h1")
        name.textContent = `Hello ${data.user}. Welcome to the admin page`
        
        document.body.appendChild(name)
        
    } catch (error) {
        console.error("Network or internal JS error:", error);
    }
}

async function performLogOut() {
    try {
        const res = await fetch("/logout")
        if (res.redirected) {
            const message = document.createElement("p");
            message.textContent = "Success! Redirecting...";
            document.body.appendChild(message);

            setTimeout(() => {
                window.location.href = res.url;
            }, 1500);
        } else {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.log(error)
    }
}

// button click callings

    if(logout_btn){
        getUser()
        logout_btn.addEventListener("click",function(){
            performLogOut()
        })
    }


if (get_login)
    get_login.addEventListener("click",() => requestAuth("login"))

if (get_register)
    get_register.addEventListener("click",() => requestAuth("register"))

if(submit_btn)
    submit_btn.addEventListener("click",() => sendValues("register"))
if(login_btn)
    login_btn.addEventListener("click",() => sendValues("login"))

