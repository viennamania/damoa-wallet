import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';


import {
	updateAssetValuation,
} from '@lib/api/agent';


// var HmacSHA256 = require('crypto-js/hmac-sha256')

import {
  HmacSHA256,
} from 'crypto-js';

import CryptoJS from 'crypto-js';

/*
function sign_sha(method, baseurl, path, data) {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
    var p = pars.sort().join("&");
    var meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    var hash = HmacSHA256(meta, config.huobi.secretkey);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
}
*/





export async function POST(request: NextRequest) {

  const body = await request.json();

  
  const {
    htxAccessKey,
    htxSecretKey,
    applicationId,
   } = body;
  


    const path = `/copytrading/trader/position_list`;



    const HOST = 'api.hbdm.com';



    const DEFAULT_HEADERS = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
    };



    const huobiBody: { [key: string]: string | number | undefined } = {
        AccessKeyId: htxAccessKey,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),

    };


    // var payload = sign_sha('GET', HOST, path, huobiBody);

    //const payload = sign_sha('GET', HOST, path, huobiBody);

    try {


      var p = '';

      var pars = [];
      for (let item in huobiBody) {
          const value = huobiBody[item];
          if (value !== undefined) {
              pars.push(item + "=" + encodeURIComponent(value));
          }
          p = pars.sort().join("&");
          var meta = ['GET', HOST, path, p].join('\n');
          
          var hash = HmacSHA256(meta, htxSecretKey);

          var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
          p += `&Signature=${Signature}`;
      }

      //console.log(p);




      const response = await fetch(`https://${HOST}${path}?${p}`, {
          method: 'GET',
          headers: DEFAULT_HEADERS,
      });

      ///console.log(response);

      if (!response) {
          return NextResponse.json({
              result: {
                  status: "error",
              },
          });
      }

      const data = await response.json();

      console.log(JSON.stringify(data));


      if (data?.code !== 200) {
        return NextResponse.json({
            result: {
                status: "error",
            },
        });
      }


      /*
      {
        "code": 200,
        "data": {
          "positions": [
            {
              "lever": "5",
              "position_side": "long",
              "contract_code": "ETH-USDT",
              "open_avg_price": "3224.31",
              "volume": "7",
              "margin_mode": "cross",
              "position_margin": "43.52558",
              "margin_rate": "0.011323183353133195",
              "unreal_profit": "-8.0738",
              "profit": "-8.0738",
              "profit_rate": "-0.178859973141540365",
              "liquidation_price": "1744.86"
            }
          ]
        },
        "tid": "35940f3fd6f8438ab03ebc5c83e6734e",
        "success": true
      }
      */



      /*
      // call updateAssetValuation
      await updateAssetValuation({
        applicationId,
        assetValuation: data.data,
      });
      */

      if (data.data.success === false) {
        return NextResponse.json({
            result: {
                status: "error",
            },
        });
      }


      return NextResponse.json({
          result: {
              status: "ok",
              data: data.data,
          }
      });
      
    } catch (error) {
        console.error("error", error);
    }

 
    return NextResponse.json({
      result: {
          status: "error",
      },
    });
  
}
