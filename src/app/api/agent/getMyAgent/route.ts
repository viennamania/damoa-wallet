import { NextResponse, type NextRequest } from "next/server";

import {
	getOneByWalletAddress,
} from '@lib/api/agent';


import axios from 'axios';
import * as crypto from 'crypto';

import moment from 'moment';

const BASE_URL = 'https://www.okx.com';

async function makeRequest(
  endpoint: string,
  API_KEY: string,
  SECRET_KEY: string,
  PASSPHRASE: string,
): Promise<any> {
  const timestamp = new Date().toISOString();
  const message = timestamp + 'GET' + endpoint;

  const signature = crypto.createHmac('sha256', SECRET_KEY)
      .update(message)
      .digest('base64');

  const headers = {
      'OK-ACCESS-KEY': API_KEY,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': PASSPHRASE,
      'Content-Type': 'application/json',
  };

  try {
      const response = await axios.get(BASE_URL + endpoint, { headers });
      return response.data;
  } catch (error : any) {
      console.error(`API 요청 오류: ${error?.message}`);
      return null;
  }
}




export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getOneByWalletAddress(walletAddress);

  if (!result) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  const {
    apiAccessKey,
    apiSecretKey,
    apiPassword,
  } = result;


  // UID 조회 부분
  const accountInfo = await makeRequest(
    '/api/v5/account/config',
    apiAccessKey,
    apiSecretKey,
    apiPassword,
  );

  if (!accountInfo) {

    console.log("accountInfo error");

    return NextResponse.error();
  }

  if (accountInfo.code !== '0') {

    console.log("accountInfo code error");

    return NextResponse.error();
  }



 
  return NextResponse.json({

    result,
    
  });
  
}
