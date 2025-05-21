import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllAgentsForAILabs,
  //getAllAgentsForLive,
	updateTradingAccountBalance,
  //updateAssetBalance,
  updateAssetValuation,

  setSumOfTradingAccountBalanceHistory,

  setSumOfTradingAccountBalanceHistoryByMarketingCenter,
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


 // when 10, 12, 14, 16, 18, 20 hours


  console.log("moment().minute()", moment().minute());
  console.log("moment().hour()", moment().hour());


  let sendSms = false;

  /*
  if (moment().minute() === 0) {

    const hour = moment().hour() + 9;

    if (
      hour === 10 || hour === 14 || hour === 18
    ) {
      sendSms = true;
    }

  }
  */

  console.log("sendSms", sendSms);

  //sendSms = false;
  


  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  

  const result = await getAllAgentsForAILabs({
    limit: 200,
    page: 1,
  });

  const applications = result?.applications || [];


  let sumOfTradingAccountBalance = 0;
  let countOfTradingAccountBalance = 0;

  let sumOfTradingAccountBalanceForOwin = 0;
  let countOfTradingAccountBalanceForOwin = 0;

  let countOfTradingAccountBalanceForPpump = 0;
  let sumOfTradingAccountBalanceForPpump = 0;



  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    const { id, apiAccessKey, apiSecretKey, apiPassword, userPhoneNumber } = application;

    if (apiAccessKey && apiSecretKey && apiPassword) {

      try {
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

            sumOfTradingAccountBalance += parseFloat(balance);
            countOfTradingAccountBalance++;

            if (application.marketingCenter === "owin") {
              sumOfTradingAccountBalanceForOwin += parseFloat(balance);
              countOfTradingAccountBalanceForOwin++;
            }

            if (application.marketingCenter === "ppump") {
              sumOfTradingAccountBalanceForPpump += parseFloat(balance);
              countOfTradingAccountBalanceForPpump++;
            }


  
            await updateTradingAccountBalance({
              applicationId: id,
              tradingAccountBalance: tradingAccountBalance,
            });

            

            //console.log(`\nTrading account: $${balance}`);

            // check each hour is on the hour

            //if (moment.valueOf() % 3600000 === 0) {

            if (sendSms) {


              if (balance > 0 && userPhoneNumber.length > 10 && userPhoneNumber.startsWith("+")) {


                try {


                  const balanceStr = Number(balance).toFixed(2);





                  const msgBody = `[TBOT] Your trading account balance is $${balanceStr}`;
              
                  const message = await client.messages.create({
                    body: msgBody,
                    from: "+17622254217",
                    to: userPhoneNumber
                  });
              
                  //console.log(message.sid);
            
                } catch (error) {
                    
                  console.log("error", error);
              
                }


              }

            } else {
              //console.log("skip sending sms");
            }


        }


      } catch (error : any) {
        console.error(`API 요청 오류: ${error?.message}`);
      }




      try {

        // Funding 계좌 조회
        const fundingInfo = await makeRequest(
          '/api/v5/asset/balances',
          apiAccessKey,
          apiSecretKey,
          apiPassword,
        );

        //console.log("fundingInfo", fundingInfo);


     
        if (fundingInfo.data.length === 0) {

            const data = {
              balance: 0,
              timestamp: moment().valueOf(),
            };

            await updateAssetValuation({
              applicationId: id,
              assetValuation: data,
            });
        }
        
        //fundingInfo.data.forEach((asset: any) => {
        fundingInfo.data.forEach(async (asset: any) => {

            if (parseFloat(asset.availBal || '0') > 0) {
                ///console.log(`  ${asset.ccy}: ${asset.availBal}`);

                const data = {
                  balance: asset.availBal,
                  timestamp: moment().valueOf(),
                };

                // call updateAssetValuation
                await updateAssetValuation({
                  applicationId: id,
                  assetValuation: data,
                });

            } else {

                const data = {
                  balance: 0,
                  timestamp: moment().valueOf(),
                };

                // call updateAssetValuation
                await updateAssetValuation({
                  applicationId: id,
                  assetValuation: data,
                });

            }

        });




      } catch (error : any) {
        console.error(`API 요청 오류: ${error?.message}`);
      }

    }

  }




  //console.log("sumOfTradingAccountBalance", sumOfTradingAccountBalance);
  //console.log("countOfTradingAccountBalance", countOfTradingAccountBalance);

  await setSumOfTradingAccountBalanceHistory(
    sumOfTradingAccountBalance,
    countOfTradingAccountBalance,
  );


  await setSumOfTradingAccountBalanceHistoryByMarketingCenter(
    sumOfTradingAccountBalanceForOwin,
    countOfTradingAccountBalanceForOwin,
    "owin",
  );

  await setSumOfTradingAccountBalanceHistoryByMarketingCenter(
    sumOfTradingAccountBalanceForPpump,
    countOfTradingAccountBalanceForPpump,
    "ppump",
  );



  
  return NextResponse.json({
    result: {
      status: "ok",
    }
  });


  
}
