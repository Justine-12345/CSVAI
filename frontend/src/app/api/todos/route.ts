import { NextRequest, NextResponse } from "next/server";

const DATA_SOURCE_URL = "https://jsonplaceholder.typicode.com/todos"
const API_KEY: string = process.env.DATA_API_KEY as string


export async function GET() {
    const res = await fetch(DATA_SOURCE_URL)
    const todos: Todo[] = await res.json()
    return NextResponse.json(todos)
}

export async function DELETE(request: Request) {

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ "message": "Todo id required" })

    await fetch(`${DATA_SOURCE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': API_KEY
        }
    })

    return NextResponse.json({ "message": `Todo ${id} deleted` })



}

export async function POST(request: Request) {

    //    FROM PARAMS 
    const {searchParams} = new URL(request.url);
    return NextResponse.json({ "message": `${searchParams.get('age')}` })

}

