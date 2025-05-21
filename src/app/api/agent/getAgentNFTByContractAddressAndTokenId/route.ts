import { NextResponse, type NextRequest } from "next/server";

import { Network, Alchemy } from 'alchemy-sdk';


import {
  getOneByWalletAddress
} from "@/lib/api/user";


const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    erc721ContractAddress,
    tokenId
  } = body;


  if (!erc721ContractAddress) {

    return NextResponse.error();
  }

  console.log("erc721ContractAddress: ", erc721ContractAddress);
  console.log("tokenId: ", tokenId);



  /*
  const response = await alchemy.nft.getNftsForOwner(
    walletAddress, {
    omitMetadata: false, // // Flag to omit metadata
    contractAddresses: [erc721ContractAddress],
  });
  */
  /*
  const response = await alchemy.nft.getNftsForContract(
    erc721ContractAddress, {
    omitMetadata: false, // // Flag to omit metadata
  });
  */


  // get quantity of NFTs for a given contract address by owner
  const responseGetNftsForOwner = await alchemy.nft.getNftsForOwner(
    walletAddress, {
    omitMetadata: true, // // Flag to omit metadata
    contractAddresses: [erc721ContractAddress],
  });

  //console.log("responseGetNftsForOwner: ", responseGetNftsForOwner);

  /*
  {
    ownedNfts: [
      {
        contractAddress: '0x796f8867E6D474C1d63e4D7ea5f52B48E4bA83D6',
        tokenId: '0',
        balance: '1'
      },
      {
        contractAddress: '0x796f8867E6D474C1d63e4D7ea5f52B48E4bA83D6',
        tokenId: '1',
        balance: '1'
      }
    ],
    pageKey: undefined,
    totalCount: 2,
    validAt: {
      blockNumber: 70036623,
      blockHash: '0xea7baf14b243ccb18bd7fff2f8791db01e19bd5d36173684d0417a53e1c7585c',
      blockTimestamp: '2025-04-08T05:53:56Z'
    }
  }
  */


  // Get the quantity of NFTs for a given contract address and tokenId by owner

  const quantity = responseGetNftsForOwner?.ownedNfts?.find(
    (nft: any) =>
      nft.contractAddress.toLowerCase() ===
      erc721ContractAddress.toLowerCase() &&
      nft.tokenId === tokenId
  );

  console.log("quantity: ", quantity);

  const quantityValue = quantity?.balance;


  
  const response = await alchemy.nft.getNftMetadata(
    erc721ContractAddress,
    parseInt(tokenId)
  );

  ///console.log("response: ", response);

  if (!response) {
    return NextResponse.json({
      result: [],
    });
    
  }

 
  // Get owner of NFT
  const owner = await alchemy.nft.getOwnersForNft(
    erc721ContractAddress,
    parseInt(tokenId)
  );

  //console.log("getOwnersForNft owner: ", owner);
  /*
  {
    owners: [ '0xAcDb8a6c00718597106F8cDa389Aac68973558B3' ],
    pageKey: null
  }
  */

  const holderWalletAddress = owner?.owners?.[0];

  ///console.log("walletAddress: ", walletAddress);

  const ownerInfo = await getOneByWalletAddress(holderWalletAddress);




  return NextResponse.json({
    result: response,
    holderWalletAddress: holderWalletAddress,
    ownerInfo: ownerInfo,
    quantity: quantityValue,
    
  });
  
}
