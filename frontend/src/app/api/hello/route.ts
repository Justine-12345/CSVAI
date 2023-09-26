import { NextResponse } from "next/server"
import { limiter } from "../config/limiter"
import { request } from "http"

export async function GET(request: Request) {

    const origin = request.headers.get('origin')

    const remaining = await limiter.removeTokens(1)
    console.log("Remaining:", remaining)

    if (remaining < 0) {
        return new NextResponse(null, {
            status: 429,
            statusText: "Too Many Request",
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Typle': 'text/plain'
            
            }
        })
    }

    return NextResponse.json({ hello: "hello" })
}
