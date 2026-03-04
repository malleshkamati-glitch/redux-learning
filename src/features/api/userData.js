

async function fetchApi(){

    const res= await fetch("https://dummyapi.io/data/v1/user");

    const data=await res.json();

    if(res.ok){
        console.log(data);
    }else{
        console.log("error occured")
    }
}

fetchApi()