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
  


   // /v1/account/accounts/{account-id}/balance

   //const path = `/v1/account/accounts`;

   //const path = `/v1/account/accounts/${accountId}/balance`;

    //const path = `/v2/account/asset-valuation`;

    
    
    const path = `/linear-swap-api/v3/unified_account_info`;

    /*
    {"code":200,"msg":"ok","data":[{"userId":null,"margin_asset":"HUSD","margin_balance":0,"margin_static":0,"cross_margin_static":0,"cross_profit_unreal":0,"margin_frozen":0,"withdraw_available":0,"cross_risk_rate":null,"cross_swap":[],"cross_future":[],"isolated_swap":[]},{"userId":null,"margin_asset":"HTX","margin_balance":0,"margin_static":0,"cross_margin_static":0,"cross_profit_unreal":0,"margin_frozen":0,"withdraw_available":0,"cross_risk_rate":null,"cross_swap":[],"cross_future":[],"isolated_swap":[]},{"userId":null,"margin_asset":"HT","margin_balance":0,"margin_static":0,"cross_margin_static":0,"cross_profit_unreal":0,"margin_frozen":0,"withdraw_available":0,"cross_risk_rate":null,"cross_swap":[],"cross_future":[],"isolated_swap":[]},{"userId":null,"margin_asset":"USDT","margin_balance":0,"margin_static":0,"cross_margin_static":0,"cross_profit_unreal":0,"margin_frozen":0,"withdraw_available":0,"cross_risk_rate":null,"cross_swap":[],"cross_future":[],"isolated_swap":[]},{"userId":null,"margin_asset":"TRX","margin_balance":0,"margin_static":0,"cross_margin_static":0,"cross_profit_unreal":0,"margin_frozen":0,"withdraw_available":0,"cross_risk_rate":null,"cross_swap":[],"cross_future":[],"isolated_swap":[]}],"ts":1731892873051}
    */


    ///const path = `/linear-swap-api/v3/swap_unified_account_type`;

    /*
    {"code":200,"msg":"ok","data":{"account_type":2},"ts":1731893288655}
    1: Non-unified account (cross-margin and isolated-margin account);2: Unified account
    */




    //const HOST = 'api.huobipro.com';
    
    //const HOST = 'api.huobi.pro';

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

        //contract_code: 'BTC-USDT-210625',

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

      //console.log(JSON.stringify(data));

      /*
{'code': 200,
          'data': [{'cross_future': [],
                    'cross_margin_static': 0,
                    'cross_profit_unreal': 0,
                    'cross_risk_rate': None,
                    'cross_swap': [],
                    'isolated_swap': [],
                    'margin_asset': 'HUSD',
                    'margin_balance': 0,
                    'margin_frozen': 0,
                    'margin_static': 0,
                    'userId': None,
                    'withdraw_available': 0.0},
                   {'cross_future': [],
                    'cross_margin_static': 0,
                    'cross_profit_unreal': 0,
                    'cross_risk_rate': None,
                    'cross_swap': [],
                    'isolated_swap': [],
                    'margin_asset': 'HT',
                    'margin_balance': 0,
                    'margin_frozen': 0,
                    'margin_static': 0,
                    'userId': None,
                    'withdraw_available': 0.0},
                   {'cross_future': [{'business_type': 'futures',
                                      'contract_code': 'TOMO-USDT-231229',
                                      'contract_type': 'quarter',
                                      'cross_max_available': 19.92483057113564,
                                      'lever_rate': 5,
                                      'margin_available': 19.92483057113564,
                                      'margin_mode': 'cross',
                                      'symbol': 'TOMO'},
                                     {'business_type': 'futures',
                                      'contract_code': 'TOMO-USDT-231110',
                                      'contract_type': 'this_week',
                                      'cross_max_available': 19.92483057113564,
                                      'lever_rate': 5,
                                      'margin_available': 19.92483057113564,
                                      'margin_mode': 'cross',
                                      'symbol': 'TOMO'}],
                    'cross_margin_static': 19.92483057113564,
                    'cross_profit_unreal': 0,
                    'cross_risk_rate': None,
                    'cross_swap': [{'business_type': 'swap',
                                    'contract_code': 'MANA-USDT',
                                    'contract_type': 'swap',
                                    'cross_max_available': 19.92483057113564,
                                    'lever_rate': 5,
                                    'margin_available': 19.92483057113564,
                                    'cross_max_available': 19.92483057113564,
                                    'margin_mode': 'cross',
                                    'symbol': 'MANA'},
                                   {'business_type': 'swap',
                                    'contract_code': 'BNT-USDT',
                                    'contract_type': 'swap',
                                    'margin_available': 19.92483057113564,
                                    'cross_max_available': 19.92483057113564,
                                    'lever_rate': 5,
                                    'margin_available': 19.92483057113564,
                                    'margin_mode': 'cross',
                                    'symbol': 'BNT'}],
                    'isolated_swap': [{'contract_code': 'BTC-USDT',
                                       'lever_rate': 200,
                                       'margin_available': 19.92483057113564,
                                       'margin_mode': 'isolated',
                                       'symbol': 'BTC',
                                       'withdraw_available': 0},
                                      {'contract_code': 'GMT-USDT',
                                       'lever_rate': 5,
                                       'margin_available': 19.92483057113564,
                                       'margin_mode': 'isolated',
                                       'symbol': 'GMT',
                                       'withdraw_available': 0}],
                    'margin_asset': 'USDT',
                    'margin_balance': 19.92483057113564,
                    'margin_frozen': 0.0,
                    'margin_static': 19.92483057113564,
                    'userId': None,
                    'withdraw_available': 19.92483057113564}],
          'msg': 'ok',
          'ts': 1699500414053}
        */


      //console.log(JSON.stringify(data.data).substring(0, 1000));


      if (data?.code !== 200) {
        return NextResponse.json({
            result: {
                status: "error",
            },
        });
      }


      // check cross_future->business_type=futures

      data?.data.forEach(async (item: any) => {

        if (item.cross_future) {
          item.cross_future.forEach(async (future: any) => {
            if (future.business_type === 'futures') {
              //console.log(future);
            }
          });
        }
      } );






      /*
      // call updateAssetValuation
      await updateAssetValuation({
        applicationId,
        assetValuation: data.data,
      });
      */


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
