import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {

    const time = new Date().toLocaleString()
   
    return NextResponse.json({ time })


}
