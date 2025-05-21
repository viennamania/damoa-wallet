import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllAgentsForAILabs,
	updateAccountConfig,
} from '@lib/api/agent';


import twilio from "twilio";



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



export const maxDuration = 300; // This function can run for a maximum of 600 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {



  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  

  const result = await getAllAgentsForAILabs({
    limit: 200,
    page: 1,
  });

  const applications = result?.applications || [];


  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    const { id, apiAccessKey, apiSecretKey, apiPassword, userPhoneNumber } = application;

    if (apiAccessKey && apiSecretKey && apiPassword) {

      try {

        // UID 조회 부분
        const accountInfo = await makeRequest(
          '/api/v5/account/config',
          apiAccessKey,
          apiSecretKey,
          apiPassword,
        );



        if (accountInfo && accountInfo.code === '0') {

            const accountConfig = {
              data: accountInfo.data?.[0],
              timestamp: moment().valueOf(),

            };

            //console.log("accountConfig", accountConfig);


            await updateAccountConfig({
              applicationId: id,
              accountConfig: accountConfig,
            });
          

        }




      } catch (error : any) {
        console.error(`API 요청 오류: ${error?.message}`);
      }



    }

  }

  
  return NextResponse.json({
    result: {
      status: "ok",
    }
  });


  
}
