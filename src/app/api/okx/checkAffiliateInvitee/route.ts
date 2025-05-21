import { NextResponse, type NextRequest } from "next/server";


import axios from 'axios';
import * as crypto from 'crypto';

import moment from 'moment';

import {
  getOneByApplicationId,
  updateAccountAffiliateInvitee,
} from '@lib/api/agent';

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
    } = body;
    
    if (!applicationId) {
      return NextResponse.json({
          result: {
            status: "error",
          }
      });
    }


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
    


    let affiliateInvitee = null;


    try {


      // get okxUid from applicationId

      const application = await getOneByApplicationId(applicationId);

      if (!application) {
        return NextResponse.json({
            result: {
              status: "error",
            }
        });
      }

      const okxUid = application.okxUid;

      const url = '/api/v5/affiliate/invitee/detail?uid=' + okxUid;

      const inviteeDetail = await makeRequest(
        url,
        apiAccessKey,
        apiSecretKey,
        apiPassword,
      );





      if (inviteeDetail && inviteeDetail.code === '51621') {
        console.log("The user isn’t your invitee");
      }




      if (inviteeDetail && inviteeDetail.code === '0') {

        const data = inviteeDetail.data;

        if (data && data.length > 0) {

          affiliateInvitee = {
            data: inviteeDetail.data?.[0],
            timestamp: moment().valueOf(),

          };

          await updateAccountAffiliateInvitee({
            applicationId: applicationId,
            affiliateInvitee,
          });
            

        }

      } else {

        console.log("inviteeDetail", inviteeDetail);
      }



    } catch (error) {
        console.error("error", error);


    }


    return NextResponse.json({
        result: {
          
          status: "ok",

          affiliateInvitee,

        },
    });



  
}
