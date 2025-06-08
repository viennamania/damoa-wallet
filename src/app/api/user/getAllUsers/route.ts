import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsers,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    limit,
    page,
    center,
    searchNickname,
  } = body;


  console.log("walletAddress", walletAddress);

  if (walletAddress !== '0xd40525acAa179b77D647f7B92cfc1A276F250415'
    && walletAddress !== '0x534ea8bf168AEBf71ea37ba2Ae0fCEC8E09aA83A') {
    return NextResponse.json({
      error: "Unauthorized",
    }, { status: 401 });
  }


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
