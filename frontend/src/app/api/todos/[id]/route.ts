
import { NextResponse } from "next/server";
import { useRouter } from "next/navigation";
import { type } from "os";
export const dynamicParams = true;



export async function POST(request: Request, { params }: { params: { id: string } }) {

    const ids = params.id
    return NextResponse.json({ "message": `${ids}` })

}
