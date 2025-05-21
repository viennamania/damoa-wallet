import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
	updateAssetValuation,
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

      let data = {};

      
      // Funding 계좌 조회
      const fundingInfo = await makeRequest(
        '/api/v5/asset/balances',
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );

      ////console.log('\nFundingInfo: ', fundingInfo);





      if (fundingInfo && fundingInfo.code === '0') {

          //console.log('\nFunding account: ' + fundingInfo.data.length);

          if (fundingInfo.data.length === 0) {

              data = {
                balance: 0,
                timestamp: moment().valueOf(),
              };

              await updateAssetValuation({
                applicationId,
                assetValuation: data,
              });

              return NextResponse.json({
                  result: {
                      status: "ok",
                      assetValuation: data,
                  }
              });
          }
          
          //fundingInfo.data.forEach((asset: any) => {
          fundingInfo.data.forEach(async (asset: any) => {

              if (parseFloat(asset.availBal || '0') > 0) {
                  ///console.log(`  ${asset.ccy}: ${asset.availBal}`);


                  data = {
                    balance: asset.availBal,
                    timestamp: moment().valueOf(),
                  };

                  // call updateAssetValuation
                  await updateAssetValuation({
                    applicationId,
                    assetValuation: data,
                  });



              }

          });


          return NextResponse.json({
            result: {
                status: "ok",
                assetValuation: data,
            }
          });

      }
    



      
    } catch (error) {
        console.error("error", error);
    }

 
    return NextResponse.json({
      result: {
          status: "error",
      },
    });
  
}
