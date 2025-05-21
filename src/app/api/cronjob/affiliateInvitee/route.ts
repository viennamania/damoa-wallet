import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
  getAllAgentsForAILabs,
	updateAccountAffiliateInvitee,
  setClaimedTradingVolumeToZero,
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



export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {


  const apiAccessKey = process.env.OKX_AFFILIATE_API_ACCESS_KEY;
  const apiSecretKey = process.env.OKX_AFFILIATE_API_SECRET_KEY;
  const apiPassword = process.env.OKX_AFFILIATE_API_PASSWORD;



  if (!apiAccessKey || !apiSecretKey || !apiPassword) {
      return NextResponse.json({
          result: {
          status: "error",
          }
      });
  }


  const result = await getAllAgentsForAILabs({
    limit: 200,
    page: 1,
  });

  const applications = result?.applications || [];

  

  for (let i = 0; i < applications.length; i++) {
    const application = applications[i];
    const { id, okxUid } = application;

    ///console.log(okxUid);



    if (!okxUid) {
      continue;
    }



    // every month 1st day 00:00:00 reset claimedTradingVolume to 0
    /*
    await setClaimedTradingVolumeToZero({
      applicationId: id,
    });
    */



    try {

      // /api/v5/affiliate/invitee/detail?uid=663688635849669342

      const url = '/api/v5/affiliate/invitee/detail?uid=' + okxUid;

      const inviteeDetail = await makeRequest(
        url,
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );

      //console.log(inviteeDetail);

      /*
      { msg: 'The user isn’t your invitee', code: '51621', data: [] }
      */

      if (inviteeDetail && inviteeDetail.code === '51621') {
        console.log("The user isn’t your invitee");
      }


      if (inviteeDetail && inviteeDetail.code === '0') {

        const data = inviteeDetail.data;

        if (data && data.length > 0) {

          const affiliateInvitee = {
            data: inviteeDetail.data?.[0],
            timestamp: moment().valueOf(),

          };

          //console.log("okxUid", okxUid, "affiliateInvitee", affiliateInvitee);



          await updateAccountAffiliateInvitee({
            applicationId: id,
            affiliateInvitee,
          });
            

        }


        /*
        [
          {
            accFee: '28.99',
            affiliateCode: '69963198',
            depAmt: '2221.86',
            firstTradeTime: '1736496000000',
            inviteeLevel: '2',
            inviteeRebateRate: '0',
            joinTime: '1736497661000',
            kycTime: '1736498089544',
            level: 'Lv1',
            region: 'South Korea',
            totalCommission: '6.66',
            volMonth: '63595.01'
          }
        ]
        */




          //console.log(inviteeDetail.data);
      }

        /*
        // UID 조회 부분
        const accountInfo = await makeRequest(
          '/api/v5/account/config',
          apiAccessKey,
          apiSecretKey,
          apiPassword,
        );


        if (accountInfo && accountInfo.code === '0') {
            const uid = accountInfo.data?.[0]?.uid;
            if (uid) {
                console.log(`\nUID: ${uid}`);

                return NextResponse.json({
                  result: {
                    status: "ok",
                    okxUid: uid,
                  },
                });


            }
        }
        */


    } catch (error) {
        console.error("error", error);


    }

  }


  return NextResponse.json({
      result: {
        status: "ok",
      },
  });



  
}
