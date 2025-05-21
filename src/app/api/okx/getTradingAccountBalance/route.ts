import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
	updateTradingAccountBalance,
} from '@lib/api/agent';



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

  
  
  const {
    applicationId,
    apiAccessKey,
    apiSecretKey,
    apiPassword,
   } = body;
  
  


   // eb6f1ca5-dd76-4ebf-ab1b-fcbbced01aef
   // 10D63437F35D4006BC8AFC026DCB296B
   // #Pado2024

   /*
    const applicationId = 1234;
    const apiAccessKey = "eb6f1ca5-dd76-4ebf-ab1b-fcbbced01aef";
    const apiSecretKey = "10D63437F35D4006BC8AFC026DCB296B";
    const apiPassword = "#Pado2024";
    */



    if (!applicationId || !apiAccessKey || !apiSecretKey || !apiPassword) {
        return NextResponse.json({
            result: {
              status: "error",
            }
        });
    }


   try {


      // /api/v5/account/config
      /*
      const accountConfig = await makeRequest(
        '/api/v5/account/config',
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );

      if (accountConfig && accountConfig.code === '0') {
          console.log(`\nAccount config: ${JSON.stringify(accountConfig.data[0])}`);

          
          {
            "acctLv": "2",
            "acctStpMode": "cancel_maker",
            "autoLoan": false,
            "ctIsoMode": "automatic",
            "enableSpotBorrow": false,
            "greeksType": "PA",
            "ip": "",
            "kycLv": "0",
            "label": "정강민",
            "level": "Lv1",
            "levelTmp": "",
            "liquidationGear": "-1",
            "mainUid": "656077440519049601",
            "mgnIsoMode": "automatic",
            "opAuth": "0",
            "perm": "read_only,trade",
            "posMode": "long_short_mode",
            "roleType": "0",
            "spotBorrowAutoRepay": false,
            "spotOffsetType": "",
            "spotRoleType": "0",
            "spotTraderInsts": [],
            "traderInsts": [],
            "type": "0",
            "uid": "656077440519049601"
          }
          


      }
      */
    


    





    
      
      const tradingInfo = await makeRequest(
        '/api/v5/account/balance',
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );
      if (tradingInfo && tradingInfo.code === '0') {
          
          //console.log(`\nTrading account: $${tradingInfo.data?.[0]?.totalEq || '0'}`);

          const balance = tradingInfo.data?.[0]?.totalEq || '0';

          const tradingAccountBalance = {
            balance: balance,
            timestamp: moment().valueOf(),
          };

          await updateTradingAccountBalance({
            applicationId,
            tradingAccountBalance: tradingAccountBalance,
          });

          return NextResponse.json({
            result: {
                status: "ok",
                tradingAccountBalance: tradingAccountBalance,
            }
          });
      }


    } catch (error : any) {
      console.error(`API 요청 오류: ${error?.message}`);
      return NextResponse.json({
        result: {
            status: "error",
        },
      });
    }


 
    return NextResponse.json({
      result: {
          status: "error",
      },
    });


  
}
