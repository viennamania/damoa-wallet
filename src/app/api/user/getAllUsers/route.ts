import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsers,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    limit,
    page,
    center,
    searchNickname,
  } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getAllUsers({
    limit,
    page,
    center,
    searchNickname,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
