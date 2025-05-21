import clientPromise from '../mongodb';




/*
          const data = {
            masterWalletAddress: masterWalletAddress,
            agentWalletAddress: agentWalletAddress,
            centerWalletAddress: centerWalletAddress,
            //platformWalletAddress: platformWalletAddress,
            amount: balance,
            masterAmount: masterAmount,
            agentAmount: agentAmount,
            centerAmount: centerAmount,
            //platformAmount: platformAmount,
            timestamp: moment().unix(),
          };



          const result = await insertReferralRewards(data);
          */




// daily check for insertReferralRewards
/*
  const collectionDay = client.db('vienna').collection('referral_rewards_day');

  // check duplicat date day and masterWalletAddress

  const checkDate = await collectionDay.findOne<any>(
    {
      createdAtDay: new Date().toISOString().slice(0, 10),
      masterWalletAddress: data.masterWalletAddress,
      contractAddress: contractAddress,
      tokenId: tokenId,
    }
  );

  return true if checkDate is null
  return false if checkDate is not null
*/

export async function checkReferralRewardsDay(data: any) {


  if (!data.masterWalletAddress || !data.contractAddress || !data.tokenId) {

    return null;
  }

  const masterWalletAddress = data.masterWalletAddress;
  const contractAddress = data.contractAddress;
  const tokenId = data.tokenId;


  const client = await clientPromise;

  const collectionDay = client.db('vienna').collection('referral_rewards_day');

  const checkDate = await collectionDay.findOne<any>(
    {
      createdAtDay: new Date().toISOString().slice(0, 10),
      masterWalletAddress: masterWalletAddress,
      contractAddress: contractAddress,
      tokenId: tokenId,
    }
  );

  if (checkDate) {
    return true;
  } else {
    return false;
  }

}


  // return true if checkDate is null





// insertReferralRewards

export async function insertReferralRewards(data: any) {


  console.log("insertReferralRewards", data);


  if (!data.masterWalletAddress || !data.agentWalletAddress || !data.centerWalletAddress) {
    return null;
  }

  const contractAddress = data.contractAddress;


  const tokenId = data.tokenId;
  const balance = data.balance;


  const client = await clientPromise;
  const collection = client.db('vienna').collection('referral_rewards');


  // collection for check duplicat date day

  const collectionDay = client.db('vienna').collection('referral_rewards_day');

  // check duplicat date day and masterWalletAddress

  const checkDate = await collectionDay.findOne<any>(
    {
      createdAtDay: new Date().toISOString().slice(0, 10),
      masterWalletAddress: data.masterWalletAddress,
      contractAddress: contractAddress,
      tokenId: tokenId,
    }
  );

  console.log("checkDate", checkDate);


  // for test
  // comment
  
  if (checkDate) {
    return null;
  }
  






  // insert and return inserted user

  if (data.masterAmount > 0) {

    const result = await collection.insertOne(
      {
        walletAddress: data.masterWalletAddress,
        contractAddress: contractAddress,
        tokenId: tokenId,
        balance: balance,
        amount: data.masterAmount,
        category: "master",
        createdAt: new Date().toISOString(),
      }
    );

  }

  if (data.agentAmount > 0) {

    const result2 = await collection.insertOne(
      {
        walletAddress: data.agentWalletAddress,
        amount: data.agentAmount,
        category: "agent",
        createdAt: new Date().toISOString(),
      }
    );

  }

  if (data.centerAmount > 0) {

    const result3 = await collection.insertOne(
      {
        walletAddress: data.centerWalletAddress,
        amount: data.centerAmount,
        category: "center",
        createdAt: new Date().toISOString(),
      }
    );

  }



    // insert day

    const resultDay = await collectionDay.insertOne(
      {
        createdAtDay: new Date().toISOString().slice(0, 10),
        masterWalletAddress: data.masterWalletAddress,
        contractAddress: contractAddress,
        tokenId: tokenId,
      }
    );



    return {

      masterWalletAddress: data.masterWalletAddress,
      masterAmount: data.masterAmount,

      agentWalletAddress: data.agentWalletAddress,
      agentAmount: data.agentAmount,

      centerWalletAddress: data.centerWalletAddress,
      centerAmount: data.centerAmount,

    };



}


/*
{
  "_id": {
    "$oid": "67f4ccd5e32ede5e968242aa"
  },
  "walletAddress": "0x214565e20B6Cf2Cd4A13552B76b2aC1294913B26",
  "contractAddress": "0x796f8867E6D474C1d63e4D7ea5f52B48E4bA83D6",
  "tokenId": {
    "$numberLong": "0"
  },
  "balance": 2,
  "amount": 0.9,
  "category": "master",
  "createdAt": "2025-04-08T07:14:29.376Z"
}
*/

// getRewards
export async function getRewards(
  limit: number,
  page: number,
  walletAddress: string,
  contractAddress: string,
  //tokenId: number,
) {

  //console.log("getRewards", limit, page, walletAddress, contractAddress);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('referral_rewards');

  // get all rewards for walletAddress, contractAddress, tokenId
  const rewards = await collection.find(
    {
      walletAddress: walletAddress,
      contractAddress: contractAddress,
      category: "master",
    }
  ).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray();
  

  //console.log("getRewards", rewards);


  return rewards;
}


// getAgentRewards
export async function getAgentRewards(
  limit: number,
  page: number,
  walletAddress: string,
  contractAddress: string,
) {

  console.log("getAgentRewards", limit, page, walletAddress, contractAddress);



  const client = await clientPromise;
  const collection = client.db('vienna').collection('referral_rewards');

  // get all rewards for walletAddress, contractAddress, tokenId
  const rewards = await collection.find(
    {
      walletAddress: walletAddress,


      //contractAddress: contractAddress,
      
      category: "agent",

    }
  ).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray();



  console.log("getAgentRewards", rewards);


  

  return rewards;
}



// getCenterRewards
export async function getCenterRewards(
  limit: number,
  page: number,
  walletAddress: string,
  contractAddress: string,
  //tokenId: number,
) {

  //console.log("getCenterRewards", limit, page, walletAddress, contractAddress, tokenId);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('referral_rewards');

  // get all rewards for walletAddress, contractAddress, tokenId
  const rewards = await collection.find(
    {
      walletAddress: walletAddress,
      
      //contractAddress: contractAddress,

      category: "center",
    }
  ).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray();
  

  return rewards;
}

