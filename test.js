import axios from "axios";



const dataTest = async ()=> {
    try {
        const data  = await axios.get("https://httpstat.us/500")
    console.log(data.data);
    } catch (error) {
        console.log(error);
    }
}

dataTest()

console.log("This is a test");