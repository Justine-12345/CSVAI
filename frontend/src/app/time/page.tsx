import getTime from "../../../lib/getTime"


export default async function Time() {

    const time = await getTime()

    return (
        <div>
            <h1>Time Now</h1>
            <div>{time.time}</div>
        </div>
    )
}
