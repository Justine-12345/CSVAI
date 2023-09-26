
export default async function getTime() {

    const time = await fetch("http://localhost:3000/api/time")
    const finalTime = await time.json()
   
    return finalTime

}


