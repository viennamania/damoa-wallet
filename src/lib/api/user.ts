import { create } from 'domain';
import clientPromise from '../mongodb';
import { id } from 'ethers';


export interface UserProps {
  /*
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
  bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  followers: number;
  verified: boolean;
  */

  id: string,
  name: string,
  nickname: string,
  email: string,
  avatar: string,
  regType: string,
  mobile: string,
  gender: string,
  weight: number,
  height: number,
  birthDate: string,
  purpose: string,
  marketingAgree: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  loginedAt: string,
  followers : number,
  emailVerified: boolean,
  bio: string,

  password: string,

  walletAddress: string,

  escrowWalletAddress: string,
  escrowWalletPrivateKey: string,

  tronWalletAddress: string,
  tronWalletPrivateKey: string,

  tronEscrowWalletAddress: string,
  tronEscrowWalletPrivateKey: string,


  erc721ContractAddress: string,

  userType: string,

  telegramId: string,

  center: string,

  start: string,

  kyc: {
    image1: string,
    image2: string,
    image3: string,
    realName: string,
    idNumber: string,
    status: string,
  },


}

export interface ResultProps {
  totalCount: number;
  users: UserProps[];
}


export async function insertOne(data: any) {

  //console.log('insertOne data: ' + JSON.stringify(data));

  if (!data.walletAddress || !data.nickname || !data.mobile) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  // check same walletAddress or smae nickname

  const checkUser = await collection.findOne<UserProps>(
    {
      $or: [
        { walletAddress: data.walletAddress },
        { nickname: data.nickname },
      ]
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  ///console.log('checkUser: ' + checkUser);


  if (checkUser) {
    return null;
  }


  // generate id 100000 ~ 999999

  const id = Math.floor(Math.random() * 900000) + 100000;


  const result = await collection.insertOne(

    {
      id: id,
      email: data.email,
      nickname: data.nickname,
      mobile: data.mobile,

      walletAddress: data.walletAddress,


      createdAt: new Date().toISOString(),

      settlementAmountOfFee: "0",
    }
  );


  if (result) {
    return {
      id: id,
      email: data.email,
      nickname: data.nickname,
      mobile: data.mobile,
    };
  } else {
    return null;
  }
  

}




export async function insertOneVerified(data: any) {

  /*
      walletAddress: walletAddress,
    nickname: nickname,
    userType: userType,
    mobile: mobile,
    telegramId: telegramId,
    center: center,
  */

  if (!data.walletAddress || !data.nickname ) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  // check same walletAddress or smae nickname

  const checkUser = await collection.findOne<UserProps>(
    {
      $or: [
        { walletAddress: data.walletAddress },
        { nickname: data.nickname },
      ]
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  console.log('checkUser: ' + JSON.stringify(checkUser));


  if (checkUser) {
    return null;
  }


  // generate id 100000 ~ 999999

  const id = Math.floor(Math.random() * 900000) + 100000;


  const result = await collection.insertOne(

    {
      id: id,
      nickname: data.nickname,
      userType: data.userType,
      mobile: data.mobile,
      telegramId: data.telegramId,
      email: data.email,
      center: data.center,
      start: data.start,

      walletAddress: data.walletAddress,


      createdAt: new Date().toISOString(),

      settlementAmountOfFee: "0",

      verified: true,
    }
  );


  if (result) {
    return {
      id: id,
      nickname: data.nickname,
      userType: data.userType,
      mobile: data.mobile,
      telegramId: data.telegramId,
      email: data.email,
    };
  } else {
    return null;
  }
  

}




export async function updateOne(data: any) {





  if (!data.walletAddress || !data.nickname) {
    return null;
  }


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  // update and return updated user

  const checkUser = await collection.findOne<UserProps>(
    
    { nickname: data.nickname }
    
  )
      


  if (checkUser) {
    return null;
  }





  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { nickname: data.nickname } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return updated;
  } else {
    return null;
  }

}



export async function updateAvatar(data: any) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  // update and return updated user

  if (!data.walletAddress || !data.avatar) {
    return null;
  }


  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { avatar: data.avatar } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return updated;
  } else {
    return null;
  }


}

/*
kyc {
  image1: string,
  image2: string,
  image3: string,
  realName: string,
  idNumber: string,
  status: string,
}
  */

// updateKycImage1
// kyc.image1
// kyc.image2
// kyc.image3
// kyc.realName
// kyc.idNumber
// kyc.status
// kyc.status = 'pending' or 'approved' or 'rejected'
export async function updateKycImage1(data: any) {

  console.log('updateKycImage1 data: ' + JSON.stringify(data));

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  // update and return updated user
  if (!data.walletAddress || !data.avatar) {
    return null;
  }

  // select one user by walletAddress and update kyc.image1

  const resultOne = await collection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
  );


  if (!resultOne) {
    return null;
  }

  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: {
      kyc: {
        image1: data.avatar,
        image2: resultOne.kyc?.image2,
        image3: resultOne.kyc?.image3,
        realName: resultOne.kyc?.realName,
        idNumber: resultOne.kyc?.idNumber,
        status: resultOne.kyc?.status,
      }
    } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return updated;
  } else {
    return null;
  }
}



// updateKycImage2
export async function updateKycImage2(data: any) {


  console.log('updateKycImage2 data: ' + JSON.stringify(data));

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  // update and return updated user
  if (!data.walletAddress || !data.avatar) {
    return null;
  }

  // select one user by walletAddress and update kyc.image2
  const resultOne = await collection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
  );
  if (!resultOne) {
    return null;
  }
  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: {
      kyc: {
        image1: resultOne.kyc?.image1,
        image2: data.avatar,
        image3: resultOne.kyc?.image3,
        realName: resultOne.kyc?.realName,
        idNumber: resultOne.kyc?.idNumber,
        status: resultOne.kyc?.status,
      }
    } }
  );
  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );
    return updated;
  } else {
    return null;
  }
}




// updateKycImage3

export async function updateKycImage3(data: any) {

  console.log('updateKycImage3 data: ' + JSON.stringify(data));

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  // update and return updated user
  if (!data.walletAddress || !data.avatar) {
    return null;
  }

  // select one user by walletAddress and update kyc.image3
  const resultOne = await collection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
  );
  if (!resultOne) {
    return null;
  }
  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: {
      kyc: {
        image1: resultOne.kyc?.image1,
        image2: resultOne.kyc?.image2,
        image3: data.avatar,
        realName: resultOne.kyc?.realName,
        idNumber: resultOne.kyc?.idNumber,
        status: resultOne.kyc?.status,
      }
    } }
  );
  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return updated;
  } else {
    return null;
  }
}




// updateKycInfo
export async function updateKycInfo(data: any) {

  console.log('updateKycInfo data: ' + JSON.stringify(data));

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  // update and return updated user
  if (!data.walletAddress || !data.realName || !data.idNumber) {
    return null;
  }

  // select one user by walletAddress and update kyc.image3
  const resultOne = await collection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
  );
  if (!resultOne) {
    return null;
  }
  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: {
      kyc: {
        createdAt: new Date().toISOString(),
        image1: resultOne.kyc?.image1,
        image2: resultOne.kyc?.image2,
        image3: resultOne.kyc?.image3,
        realName: data.realName,
        idNumber: data.idNumber,
        status: 'pending',
      }
    } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
    );

    return updated;
  } else {
    return null;
  }
}





export async function updateSellerStatus(data: any) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  // update and return updated user

  if (!data.walletAddress || !data.sellerStatus || !data.bankName || !data.accountNumber || !data.accountHolder) {
    return null;
  }

  const seller = {
    status: data.sellerStatus,
    bankInfo: {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
    }
  };
  


  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { seller: seller } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
      { projection: { _id: 0, emailVerified: 0 } }
    );

    return updated;
  } else {
    return null;
  }


}



export async function getOneByWalletAddress(
  walletAddress: string,
): Promise<UserProps | null> {

  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  const collection = client.db('vienna').collection('users');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { walletAddress: walletAddress },
  );


  //console.log('getOneByWalletAddress results: ' + results);

  return results;

}




export async function getOneByNickname(
  nickname: string,
): Promise<UserProps | null> {

  const client = await clientPromise;

  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { nickname: nickname },
  );

  return results;

}




export async function getOneByContractAddress(
  erc721ContractAddress: string,
): Promise<UserProps | null> {

  console.log('getOneByContractAddress erc721ContractAddress: ' + erc721ContractAddress);

  const client = await clientPromise;

  const collection = client.db('vienna').collection('users');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { erc721ContractAddress: erc721ContractAddress },
  );


  return results;

}


export async function getOneByTronWalletAddress(
  tronWalletAddress: string,
): Promise<UserProps | null> {

  //console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;

  const collection = client.db('vienna').collection('users');



  ///console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  // id is number

  const results = await collection.findOne<UserProps>(
    { tronWalletAddress: tronWalletAddress },
  );


  //console.log('getOneByWalletAddress results: ' + results);

  return results;

}




// find nickname - searchNickname
export async function getAllUsers(
  {
    limit,
    page,
    center,
    searchNickname,
  }: {
    limit: number;
    page: number;
    center: string;
    searchNickname: string;
  }
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null
  // order by nickname asc


  const users = await collection
    .find<UserProps>(
      {
        

        // nickname is like searchNickname
        nickname: { $regex: searchNickname, $options: 'i' },

        

      },
      {
        limit: limit,
        skip: (page - 1) * limit,
      },
      
    )
    .sort({ createdAt: -1 })
    .toArray();


  // user info
  // walletAddress, nickname, mobile, email, tronWalletAddress

  const resultUsers = users.map((user) => {
    return {
      id: user?.id,
      createdAt: user?.createdAt,
      avatar: user?.avatar,
      walletAddress: user?.walletAddress,
      nickname: user?.nickname,
      mobile: user?.mobile,
      email: user?.email,
      start: user?.start,
    };
  } );

  const totalCount = await collection.countDocuments(
    {
      
    }
  );

  return {
    totalCount,
    users: resultUsers,
  };

  
}




export async function getBestSellers(
  {
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {


        // seller is exist and seller status is 'confirmed'

        seller: { $exists: true },
        

      },
      {
        limit: limit,
        skip: (page - 1) * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      seller: { $exists: true },
    }
  );

  return {
    totalCount,
    users,
  };

  
}










export async function getUserWalletPrivateKeyByWalletAddress(
  walletAddress: string,
): Promise<string | null> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { walletAddress },
    { projection: { _id: 0, emailVerified: 0 } }
  ) as any;

  console.log('getUserWalletPrivateKeyByWalletAddress results: ' + results);

  if (results) {
    return results.walletPrivateKey;
  } else {
    return null;
  }

}


export async function getUserByEmail(
  email: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  return await collection.findOne<UserProps>(
    { email },
    { projection: { _id: 0, emailVerified: 0 } }
  );

}


export async function checkUserByEmail(
  email: string,
  password: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  const results = await collection.findOne<UserProps>(
    {
      email,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  ///console.log('getUser results: ' + results);

  if (results) {
    return {
      ...results,
      ///bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }

}


export async function loginUserByEmail(
  email: string,
  password: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  const results = await collection.findOne<UserProps>(
    {
      email,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  if (results) {
    
    // user_login_sesson
    const sessionCollection = client.db('vienna').collection('user_login_sessions');
    const sessionResults = await sessionCollection.insertOne({
      id: results.id,
      email: results.email,
      loginedAt: new Date().toISOString(),
    });

    console.log('sessionResults: ' + sessionResults);

    return {
      ...results,
      ...sessionResults,
      ///bioMdx: await getMdxSource(results.bio || placeholderBio)
    }

  } else {
    return null;
  }


}









export async function searchUser(query: string): Promise<UserProps[]> {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  
  return await collection
    .aggregate<UserProps>([
      {
        $search: {
          index: 'name-index',
          /* 
          name-index is a search index as follows:

          {
            "mappings": {
              "fields": {
                "followers": {
                  "type": "number"
                },
                "name": {
                  "analyzer": "lucene.whitespace",
                  "searchAnalyzer": "lucene.whitespace",
                  "type": "string"
                },
                "username": {
                  "type": "string"
                }
              }
            }
          }

          */
          text: {
            query: query,
            path: {
              wildcard: '*' // match on both name and username
            },
            fuzzy: {},
            score: {
              // search ranking algorithm: multiply relevance score by the log1p of follower count
              function: {
                multiply: [
                  {
                    score: 'relevance'
                  },
                  {
                    log1p: {
                      path: {
                        value: 'followers'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        // filter out users that are not verified
        $match: {
          verified: true
        }
      },
      // limit to 10 results
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          emailVerified: 0,
          score: {
            $meta: 'searchScore'
          }
        }
      }
    ])
    .toArray();
}

export async function getUserCount(): Promise<number> {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  return await collection.countDocuments();
}



export async function updateUser(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  // check dupplicated nickname




  return await collection.updateOne({ username }, { $set: { bio } });
}




export async function checkUser(id: string, password: string): Promise<UserProps | null> {
  

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');
  const results = await collection.findOne<UserProps>(
    {
      id,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );
  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}



// get user 



export async function getAllUsersForSettlement(
  limit: number,
  page: number,
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {
        walletAddress: { $exists: true, $ne: null },
        walletPrivateKey: { $exists: true, $ne: null },

      },
      {
        limit: limit,
        skip: (page - 1) * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      walletPrivateKey: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users,
  };

}




export async function getAllUsersForSettlementOfStore(
  limit: number,
  page: number,
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null },
        walletPrivateKey: { $exists: true, $ne: null },

        // when settlementAmountOfFee is exist, check settlementAmountOfFee is 0

        settlementAmountOfFee: {
          $exists: true,
          $eq: "0"
        }, 

      },
      {
        limit: limit,
        skip: (page - 1) * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      walletPrivateKey: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users,
  };

}




// update settlementAmountOfFee for User collection
export async function updateSettlementAmountOfFee(
  walletAddress: string,
  settlementAmountOfFee: string,
) {

  console.log('updateSettlementAmountOfFee walletAddress: ' + walletAddress + ' settlementAmountOfFee: ' + settlementAmountOfFee);
  
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        settlementAmountOfFee,
      }
    }
  );
  
  }

// getAllUsersForSettlementOfFee

export async function getAllUsersForSettlementOfFee(
  limit: number,
  page: number,
): Promise<ResultProps> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null

  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null },
        walletPrivateKey: { $exists: true, $ne: null },

        // when settlementAmountOfFee is exist, check convert settlementAmountOfFee to float number and check settlementAmountOfFee is greater than 0

        settlementAmountOfFee: {
          $exists: true,
          $ne: "0"
        }, 

      },
      {
        limit: limit,
        skip: (page - 1) * limit,
      },
      
    )
    .sort({ _id: -1 })
    .toArray();


  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      walletPrivateKey: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users,
  };

}


// setEscrowWalletAddressByWalletAddress
export async function setEscrowWalletAddressByWalletAddress(
  walletAddress: string,
  escrowWalletAddress: string,
  escrowWalletPrivateKey: string,
) {



  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        escrowWalletAddress,
        escrowWalletPrivateKey,
      }
    }
  );
  
}



// setTronWalletAddressByWalletAddress
export async function setTronWalletAddressByWalletAddress(
  walletAddress: string,
  tronWalletAddress: string,
  tronWalletPrivateKey: string,
) {



  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        tronWalletAddress,
        tronWalletPrivateKey,
      }
    }
  );
  
}




// setTronEscrowWalletAddressByWalletAddress
export async function setTronEscrowWalletAddressByWalletAddress(
  walletAddress: string,
  tronEscrowWalletAddress: string,
  tronEscrowWalletPrivateKey: string,
) {



  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        tronEscrowWalletAddress,
        tronEscrowWalletPrivateKey,
      }
    }
  );
  
}








export async function setErc721ContractAddressByWalletAddress(
  walletAddress: string,
  erc721ContractAddress: string,
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        walletAddress: walletAddress,
        erc721ContractAddress: erc721ContractAddress,
      }
    }
  );
  
}




export async function setMasterBotContractAddressByWalletAddress(
  walletAddress: string,
  masterBotContractAddress: string,
) {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  return await collection.updateOne(
    { walletAddress },
    {
      $set: {
        walletAddress: walletAddress,
        masterBotContractAddress: masterBotContractAddress,
      }
    }
  );
  
}









export async function getAllAgents(
  {
    limit = 300,
    page = 1,
  }: {
    limit: number;
    page: number;
  }
): Promise<any> {


  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  console.log('limit: ' + limit);
  console.log('page: ' + page);

  // walletAddress is not empty and not null
  // order by nickname asc

  // where erc721ContractAddress is not empty and not null


    // exclude nickname is 'solongos'



  const users = await collection
    .find<UserProps>(
      {


        walletAddress: { $exists: true, $ne: null},
        verified: true,

        
        erc721ContractAddress: { $exists: true, $ne: null },

        /*
        https://t.me/owin_kingkong_bot
        https://t.me/owin_shingyu_bot
        https://t.me/owin_young_bot
        https://t.me/owin_drosi_bot
        https://t.me/owin_ok_bot
        https://t.me/owin_nyong_bot
        https://t.me/owin_kok_bot
        https://t.me/owin_anawin_bot
        https://t.me/owin_kek_bot
        https://t.me/owin_zzanga_bot
        https://t.me/owin_sunoo_bot
        */

        /*
        $or: [
          { center: 'owin_kingkong_bot' },
          { center: 'owin_shingyu_bot' },
          { center: 'owin_young_bot' },
          { center: 'owin_drosi_bot' },
          { center: 'owin_ok_bot' },
          { center: 'owin_nyong_bot' },
          { center: 'owin_kok_bot' },
          { center: 'owin_anawin_bot' },
          { center: 'owin_kek_bot' },
          { center: 'owin_zzanga_bot' },
          { center: 'owin_sunoo_bot' },
        ]
        */
        // center is start with 'owin_'

        center: { $regex: /^owin_/ },
          
        

        
      },
      {
        limit: limit,
        skip: (page - 1) * limit,
      },
      
    )
    .sort({ nickname: 1 })
    .toArray();


  // user info
  // walletAddress, nickname, mobile, email, tronWalletAddress

  const resultUsers = users.map((user) => {
    return {
      walletAddress: user.walletAddress,
      nickname: user.nickname,
      avatar: user.avatar,
      userType: user.userType,
      mobile: user.mobile,
      telegramId: user.telegramId,
      email: user.email,
      center: user.center,
      tronWalletAddress: user.tronWalletAddress,
      erc721ContractAddress: user.erc721ContractAddress,
    };
  } );

  const totalCount = await collection.countDocuments(
    {
      walletAddress: { $exists: true, $ne: null },
      verified: true,
      erc721ContractAddress: { $exists: true, $ne: null },
    }
  );

  return {
    totalCount,
    users: resultUsers,
  };

  
}


// get all ercy721ContractAddress from users collection
export async function getAllErc721ContractAddresses(): Promise<string[]> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.distinct('erc721ContractAddress');

  return results;

}





// getReferredMembers
// start is referralCode
// order by createdAt desc
export async function getReferredMembers(referralCode: string): Promise<UserProps[]> {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');

  const results = await collection.find<UserProps>(
    {
      start: referralCode,
    },
  )
    .sort({ createdAt: -1 })
    .toArray();

  return results;
}


// getOneByTelegramId
export async function getOneByTelegramId(
  telegramId: string,
): Promise<UserProps | null> {

  const client = await clientPromise;

  const collection = client.db('vienna').collection('users');

  const results = await collection.findOne<UserProps>(
    { telegramId },
  );

  return results;

}