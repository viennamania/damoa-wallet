import { NextResponse, type NextRequest } from "next/server";



import {
	getAllApplicationsForCenter,
  getSummaryApplicationsForCenter,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { center } = body;

  if (!center) {
    return NextResponse.error();
  }


    const result = await getAllApplicationsForCenter({
      center,
    });

    const resultSummary = await getSummaryApplicationsForCenter({
      center,
    });

    //console.log("resultSummary", resultSummary);


    return NextResponse.json({
  
      result,
      resultSummary,
      
    });
  
}
