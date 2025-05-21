import { NextResponse, type NextRequest } from "next/server";

import {
  getOneByApplicationId,
	setSettlementClaim,
} from '@lib/api/agent';



import {
	createThirdwebClient,

	///ContractOptions,

	getContract,
	sendAndConfirmTransaction,
	
	sendBatchTransaction,

	SendBatchTransactionOptions,
  
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
	privateKeyToAccount,
	smartWallet,
	getWalletBalance,
	SmartWalletOptions,
} from "thirdweb/wallets";

import {
	mintTo,
	totalSupply,
	transfer,
	
	getBalance,
  
	balanceOf,
  
} from "thirdweb/extensions/erc20";


import { Network, Alchemy } from 'alchemy-sdk';




const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);





export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {

  const body = await request.json();


  const { applicationId } = body;

  if (!applicationId) {
    return NextResponse.error();
  }





  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY || "",
  });

  /*
  const contractOptions: ContractOptions = {
    client: client,
    chain: chain,
    address: tokenContractAddressUSDT,
  };
  */
  
  const contractUSDT = getContract(
    //contractOptions
    {
      client: client,
      chain: chain,
      address: tokenContractAddressUSDT,
    }
  );

  const claimWalletPrivateKey = process.env.CLAIM_WALLET_PRIVATE_KEY || "";

  const personalAccount = privateKeyToAccount({
    client,
    privateKey: claimWalletPrivateKey,
  });

  const wallet = smartWallet({
    chain: chain,
    sponsorGas: true,
  });

  const account = await wallet.connect({
    client: client,
    personalAccount: personalAccount,
  });

  const claimWalletAddress = account.address;

  //console.log("claimWalletAddress: ", claimWalletAddress);
  // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2




  const application = await getOneByApplicationId(applicationId);


  //console.log("application: ", application);




  if (!application) {

    console.error('application: ' + application);

    return NextResponse.error();
  }


  try {

      const okxUid = application.okxUid;
      const tradingAccountBalance = application.tradingAccountBalance;

      const lastUnclaimedTradingVolume = parseFloat(application?.lastUnclaimedTradingVolume) || 0;

      const claimedTradingVolume = parseFloat(application?.claimedTradingVolume) || 0;

      const tradingVolume = parseFloat(application.affiliateInvitee?.data?.volMonth) || 0;

      /*
      if (tradingVolume <= (claimedTradingVolume + 1000)) {
        return NextResponse.error();
      }
      */


      const settlementTradingVolume = tradingVolume - claimedTradingVolume;




      const totalSettlementTradingVolume = settlementTradingVolume + lastUnclaimedTradingVolume;

      //console.log("totalSettlementTradingVolume: ", totalSettlementTradingVolume);

      if (totalSettlementTradingVolume <= 0) {

        console.error('totalSettlementTradingVolume: ' + totalSettlementTradingVolume);

        return NextResponse.error();
      }



      // 1. master wallet address
      const masterWalletAddress = application.walletAddress;


      // 2. agent wallet address
      // get agentWalletAddress from agentBot and agentBotNumber
      //     const response = await alchemy.nft.getOwnersForNft(address, tokenId)

      const nftContractAddress = application.agentBot;
      const tokenId = application.agentBotNumber;

      const agentReferral = application.agentBot + "_" + application.agentBotNumber;


      const response = await alchemy.nft.getOwnersForNft(nftContractAddress, tokenId);
      /* { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] } */

      //console.log("response: ", response);

      const agentWalletAddress = response?.owners[0] || "";

      //console.log("agentWalletAddress: ", agentWalletAddress);

      if (!agentWalletAddress) {

        console.error('agentWalletAddress: ' + agentWalletAddress);

        return NextResponse.error();
      }


      // 3. center wallet address
      //const centerWalletAddress = "";
      // api call to get centerWalletAddress
      // POST https://https://shinemywinter.vercel.app/api/user/getCenterOwnerByCenter
      // { center: center }

      const center = application.center;

      const marketingCenter = application.marketingCenter;


      const getCenterOwnerByCenter = await fetch(`https://shinemywinter.vercel.app/api/user/getCenterOwnerByCenter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
        }),
      })

      const centerOwner = await getCenterOwnerByCenter.json();

      ///console.log('centerOwner: ' + JSON.stringify(centerOwner));


      let centerWalletAddress = centerOwner?.result?.walletAddress || "";

      // if center owner is not found, use default center wallet address
      if (!centerWalletAddress) {

        console.error('centerWalletAddress: ' + centerWalletAddress);

        //return NextResponse.error();

        centerWalletAddress = "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C";

      }




      const tradingFee = totalSettlementTradingVolume * 0.000455;


      // calculate insentive
      //////////////////////////////////////////////////////////////

      /*
      //const rewardRate = 0.23;
      const insentive = Number(tradingFee * 0.23).toFixed(8);

      const masterInsentive = Number(tradingFee * 0.23 * 0.56).toFixed(8);

      const agentInsentive = Number(tradingFee * 0.23 * 0.28).toFixed(8);

      const centerInsentive = Number(tradingFee * 0.23 * 0.14).toFixed(8);
      
      */


      const rewardRate = 0.35;


      const insentive = Number(tradingFee * rewardRate).toFixed(8);


      const platformFee = Number(parseFloat(insentive) * 0.03).toFixed(8);
      const platformFeeWalletAddress = "0x307a187b2d75aB38Ee7900F28C566043EB21F5C5";




      const totalReward = Number(parseFloat(insentive) - parseFloat(platformFee)).toFixed(8);

      const masterInsentive = Number(parseFloat(totalReward) * 0.56).toFixed(8);

      const agentInsentive = Number(parseFloat(totalReward) * 0.28).toFixed(8);

      const centerInsentive = Number(parseFloat(totalReward) * 0.14).toFixed(8);
      
 




      const transactionPlatformWalletAddress = transfer({
        contract: contractUSDT,
        to: platformFeeWalletAddress,
        amount: platformFee,
      });


      const transactionMasterWalletAddress = transfer({
        contract: contractUSDT,
        to: masterWalletAddress,
        amount: masterInsentive,
      });

      const transactionAgentWalletAddress = transfer({
        contract: contractUSDT,
        to: agentWalletAddress,
        amount: agentInsentive,
      });

      const transactionCenterWalletAddress = transfer({
        contract: contractUSDT,
        to: centerWalletAddress,
        amount: centerInsentive,
      });

      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: [
          transactionPlatformWalletAddress,
          transactionMasterWalletAddress,
          transactionAgentWalletAddress,
          transactionCenterWalletAddress,
        ],
      };


      const batchResponse = await sendBatchTransaction(
        batchOptions
      );


      //console.log("batchResponse: ", batchResponse);

      if (!batchResponse) {
        
        console.error("batchResponse: ", batchResponse);

        return NextResponse.error();
      }



      // get nft info form alchemy
      // nftContractAddress, tokenId

      const responseNftInfo = await alchemy.nft.getNftMetadata(
        nftContractAddress,
        parseInt(tokenId)
      );






      const settlementClaim = {
        okxUid: okxUid,
        tradingAccountBalance: tradingAccountBalance,
        tradingVolume: tradingVolume,
        settlementTradingVolume: settlementTradingVolume,
        totalSettlementTradingVolume: totalSettlementTradingVolume,
        rewardRate: rewardRate,
        tradingFee: tradingFee,
        insentive: insentive,

        masterInsentive: masterInsentive,
        masterWalletAddress: masterWalletAddress,

        agentContract: nftContractAddress,
        agentTokenId: tokenId,
        agentBotNft: responseNftInfo,
        agentReferral: agentReferral,
        agentInsentive: agentInsentive,
        agentWalletAddress: agentWalletAddress,

        center: center,
        marketingCenter: marketingCenter,
        centerInsentive: centerInsentive,
        centerWalletAddress: centerWalletAddress,
      };


      

      
      const result = await setSettlementClaim({
        applicationId: applicationId,
        settlementClaim: settlementClaim,
      });


      /*
      if (!result) {
        return NextResponse.error();
      }
      */




      // master insentive message
      // https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress
      // POST

      ///console.log("masterWalletAddress: ", masterWalletAddress);
      ///console.log("masterInsentive: ", masterInsentive);


      // totalSettlementTradingVolume 채굴량을 보상으로 000 USDT를 지급하였습니다.
      const messageMaster = `${Number(totalSettlementTradingVolume).toFixed(0)} 채굴량을 보상으로 ${Number(masterInsentive).toFixed(6)} USDT를 지급하였습니다.`;

      await fetch(`https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
          walletAddress: masterWalletAddress,
          //message: `You have received ${masterInsentive} USDT as master incentive.`,
          message: messageMaster,
        }),
      })


      // agent insentive message
      // https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress
      // POST

      
      const agentInsentiveMessage = `${Number(totalSettlementTradingVolume).toFixed(0)} 채굴량을 보상으로 ${Number(agentInsentive).toFixed(6)} USDT를 지급하였습니다.`;

      await fetch(`https://shinemywinter.vercel.app/api/telegram/setAgentMessageByWalletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
          contract: nftContractAddress,
          tokenId: tokenId,
          agentBotNft: responseNftInfo,
          walletAddress: agentWalletAddress,
          //message: `You have received ${agentInsentive} USDT as agent incentive.`,
          message: agentInsentiveMessage,
        }),
      })

      /*

      // center insentive message
      // https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress
      // POST

      const centerInsentiveMessage = `${Number(totalSettlementTradingVolume).toFixed(0)} 채굴량을 보상으로 ${Number(centerInsentive).toFixed(6)} USDT를 지급하였습니다.`;

      await fetch(`https://shinemywinter.vercel.app/api/telegram/setSettlementMessageByWalletAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: center,
          walletAddress: centerWalletAddress,
          //message: `You have received ${centerInsentive} USDT as center incentive.`,
          message: centerInsentiveMessage,
        }),
      })

      */
    






      return NextResponse.json({
        result: result,
      });



  } catch (error) {
    console.error(error+"");
    return NextResponse.error();
  }

  

  
}
