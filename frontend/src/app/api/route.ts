import { NextResponse } from "next/server"

export async function GET() {

    const result = await fetch('https://restcountries.com/v3.1/all')
    const data = await result.json()
    
    return NextResponse.json({data})

}