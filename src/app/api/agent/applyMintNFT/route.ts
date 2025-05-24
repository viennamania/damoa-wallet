import { NextResponse, type NextRequest } from "next/server";

import {
	insertOne,
  getOneByOkxUid,
} from '@lib/api/agent';

// getOneByContractAddress
import {
  getOneByContractAddress,
} from '@lib/api/user';

import twilio from "twilio";


import moment from 'moment';


import axios from 'axios';
import * as crypto from 'crypto';

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

  /*
  walletAddress: address,
  agentBot: agentBot,
  userName: userName,
  userPhoneNumber: userPhoneNumber,
  userEmail: userEmail,
  htxUid: htxUid,
  htxUsdtWalletAddress: htxUsdtWalletAddress,
  apiAccessKey: apiAccessKey,
  apiSecretKey: apiSecretKey,
  */

  const { marketingCenter, center, walletAddress, agentBot, agentBotNumber, userName, userPhoneNumber, userEmail, userTelegramId, exchange, htxUsdtWalletAddress, apiAccessKey, apiSecretKey, apiPassword } = body;



  // UID 조회 부분
  const accountInfo = await makeRequest(
    '/api/v5/account/config',
    apiAccessKey,
    apiSecretKey,
    apiPassword,
  );

  if (!accountInfo) {
    return NextResponse.error();
  }

  if (accountInfo.code !== '0') {
    return NextResponse.error();
  }

  const accountConfig = {
    data: accountInfo.data?.[0],
    timestamp: moment().valueOf(),

  };

  const uid = accountInfo.data?.[0]?.uid;

  console.log("applyMintNFT uid", uid);



  if (!uid) {
    return NextResponse.error();
  }

  // if uid is already exists, return error
  const resultByUid = await getOneByOkxUid(uid);
  if (resultByUid) {
    return NextResponse.error();
  }



  const result = await insertOne({
    marketingCenter: marketingCenter,
    center: center,
    walletAddress: walletAddress,
    agentBot: agentBot,
    agentBotNumber: agentBotNumber,
    userName: userName,
    userPhoneNumber: userPhoneNumber,
    userEmail: userEmail,
    userTelegramId: userTelegramId,
    exchange: exchange,

    okxUid: uid,
    accountConfig: accountConfig,

    htxUsdtWalletAddress: htxUsdtWalletAddress,
    apiAccessKey: apiAccessKey,
    apiSecretKey: apiSecretKey,
    apiPassword: apiPassword,
  });


  if (!result) {
    return NextResponse.error();
  }

  //console.log("result", result);

  /*
  const applicationId = result.id;

  // send sms to agent holder
  // get user phone number by erc721ContractAddress is agentBot
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);


  const user = await getOneByContractAddress(agentBot);
  if (user) {
    const { mobile } = user;

    if (mobile && mobile.length > 10) {

      try {

        const msgBody = `[똑똑한코인] [TID:#${applicationId}] You have a new agent application from [${userName}]`;

        const message = await client.messages.create({
          body: msgBody,
          from: "+17622254217",
          to: mobile,
        });

      } catch (error) {
        console.error("error", error);
      }
    }
  }
  

  if (userPhoneNumber && userPhoneNumber.length > 10) {

    try {
      // send sms to userPhoneNumber
      const msgBody = `[똑똑한코인] [TID:#${applicationId}] Your master bot application has been submitted successfully!`;

      const message = await client.messages.create({
        body: msgBody,
        from: "+17622254217",
        to: userPhoneNumber,
      });
    } catch (error) {
      console.error("error", error);
    }
  
  }
  */

 
  return NextResponse.json({

    result,
    
  });
  
}
