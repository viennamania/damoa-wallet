// nickname settings
'use client';
import React, { useEffect, useState, Suspense } from "react";



import { toast } from 'react-hot-toast';


///import { toast } from 'react-toastify';




import { client } from "../../../client";

import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { deployERC721Contract } from 'thirdweb/deploys';


import {
    getOwnedNFTs,
    mintTo
} from "thirdweb/extensions/erc721";




import {
    polygon,
    arbitrum,
    ethereum,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,

    useConnectedWallets,
    useSetActiveWallet,

} from "thirdweb/react";



import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

import {
    getUserPhoneNumber,
    getProfiles,
} from "thirdweb/wallets/in-app";


import Image from 'next/image';

import GearSetupIcon from "@/components/gearSetupIcon";


import UploaderKyc1 from '@/components/uploaderKyc1';
import UploaderKyc2 from '@/components/uploaderKyc2';
import UploaderKyc3 from '@/components/uploaderKyc3';

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 

import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../../dictionaries";

import {
    useRouter,
    useSearchParams,
} from "next//navigation";








/*
const wallet = smartWallet({
    chain: polygon,
    sponsorGas: true, // enable sponsored transactions
});



// any wallet can be used as an admin account
// in this example we use an in-app wallet

const adminWallet = inAppWallet();


const personalAccount = await adminWallet.connect({
  client,
  chain: polygon,
  strategy: "google",
});

 
const smartAccount = await wallet.connect({
  client,
  personalAccount, // pass the admin account
});
*/





const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon

const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum




const wallets = [
    inAppWallet({
      auth: {
        options: [
          "google",
          "discord",
          "email",
          "x",
          "passkey",
          "phone",
          "facebook",
          "line",
          "apple",
          "coinbase",
        ],
      },
    }),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
    createWallet("io.metamask"),
    //createWallet("com.binance.wallet"),
    createWallet("com.bitget.web3"),
    createWallet("com.trustwallet.app"),
    createWallet("com.okex.wallet"),
];









function AgentPage(
    {
        params,
    }: {
        params: {
            lang: string;
            chain: string;
        };
    }
) {
    const { lang, chain } = params;

    const searchParams = useSearchParams();

    const center = searchParams.get('center');

    const start = searchParams.get('start') || "0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_143";

    const agent = start?.split('_')[0];
    const agentNumber = start?.split('_')[1];




    const contract = getContract({
        // the client you have created via `createThirdwebClient()`
        client,
        // the chain the contract is deployed on
        
        
        chain: params.chain === "arbitrum" ? arbitrum : polygon,
      
      
      
        // the contract's address
        ///address: contractAddress,
    
        address: params.chain === "arbitrum" ? contractAddressArbitrum : contractAddress,
    
    
        // OPTIONAL: the contract's abi
        //abi: [...],
      });
    
    


      

    
    
    const [data, setData] = useState({
        title: "",
        description: "",
    
        menu : {
        buy: "",
        sell: "",
        trade: "",
        chat: "",
        history: "",
        settings: "",
        },
    
        Go_Home: "",
        My_Balance: "",
        My_Nickname: "",
        My_Buy_Trades: "",
        My_Sell_Trades: "",
        Buy: "",
        Sell: "",
        Buy_USDT: "",
        Sell_USDT: "",
        Contact_Us: "",
        Buy_Description: "",
        Sell_Description: "",
        Send_USDT: "",
        Pay_USDT: "",
        Coming_Soon: "",
        Please_connect_your_wallet_first: "",

        Wallet_Settings: "",
        Profile_Settings: "",

        Profile: "",
        My_Profile_Picture: "",
  
        Edit: "",


        Cancel: "",
        Save: "",
        Enter_your_nickname: "",
        Nickname_should_be_5_10_characters: "",

        Seller: "",
        Not_a_seller: "",
        Apply: "",
        Applying: "",
        Enter_your_bank_name: "",
        Enter_your_account_number: "",
        Enter_your_account_holder: "",
        Send_OTP: "",
        Enter_OTP: "",
        Verify_OTP: "",
        OTP_verified: "",

        Nickname_should_be_alphanumeric_lowercase: "",
        Nickname_should_be_at_least_5_characters_and_at_most_10_characters: "",
  
    
    } );
    
    useEffect(() => {
        async function fetchData() {
            const dictionary = await getDictionary(params.lang);
            setData(dictionary);
        }
        fetchData();
    }, [params.lang]);
    
    const {
        title,
        description,
        menu,
        Go_Home,
        My_Balance,
        My_Nickname,
        My_Buy_Trades,
        My_Sell_Trades,
        Buy,
        Sell,
        Buy_USDT,
        Sell_USDT,
        Contact_Us,
        Buy_Description,
        Sell_Description,
        Send_USDT,
        Pay_USDT,
        Coming_Soon,
        Please_connect_your_wallet_first,

        Wallet_Settings,
        Profile_Settings,

        Profile,
        My_Profile_Picture,
  
        Edit,

        Cancel,
        Save,
        Enter_your_nickname,
        Nickname_should_be_5_10_characters,

        Seller,
        Not_a_seller,
        Apply,
        Applying,
        Enter_your_bank_name,
        Enter_your_account_number,
        Enter_your_account_holder,
        Send_OTP,
        Enter_OTP,
        Verify_OTP,
        OTP_verified,

        Nickname_should_be_alphanumeric_lowercase,
        Nickname_should_be_at_least_5_characters_and_at_most_10_characters,

    } = data;
    
    



    const router = useRouter();


    
    const connectWallets = useConnectedWallets();
    const smartConnectWallet = connectWallets?.[0];
    const setActiveAccount = useSetActiveWallet();

    /*

    useEffect(() => {
        if (smartConnectWallet) {
            setActiveAccount(smartConnectWallet);
        }
    } , [smartConnectWallet, setActiveAccount]);

    */



    const activeAccount = useActiveAccount();


    ///console.log("activeAccount===", activeAccount);


    const address = activeAccount?.address;
  
  



    const activeWallet = useActiveWallet();










    
    ////console.log("activeWallet", activeWallet);



    /*
    const connectWallets = useConnectedWallets();
    const smartConnectWallet = connectWallets?.[0];
    const setActiveAccount = useSetActiveWallet();
    useEffect(() => {
        setActiveAccount(
            smartConnectWallet
        )

    } , [smartConnectWallet , setActiveAccount]);
    */


      
    ////console.log("address", address);
 
    /*
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
  
  
      if (address) {
  
        //const phoneNumber = await getUserPhoneNumber({ client });
        //setPhoneNumber(phoneNumber);
  
  
        getUserPhoneNumber({ client }).then((phoneNumber) => {
          setPhoneNumber(phoneNumber || "");
        });
  
  
  
      }
  
    } , [address]);
    */










    const [balance, setBalance] = useState(0);
    useEffect(() => {
  
      // get the balance
      const getBalance = async () => {

        if (!address) {
            return;
        }
  
        ///console.log('getBalance address', address);
  
        
        const result = await balanceOf({
          contract,
          address: address,
        });
  
    
        //console.log(result);
  
        if (!result) return;
    
        setBalance( Number(result) / 10 ** 6 );
  
      };
  
      if (address) getBalance();
  
      const interval = setInterval(() => {
        if (address) getBalance();
      } , 1000);
  
      return () => clearInterval(interval);
  
    } , [address, contract]);


    ///console.log("balance", balance);










    const [editUsdtPrice, setEditUsdtPrice] = useState(0);
    const [usdtPriceEdit, setUsdtPriceEdit] = useState(false);
    const [editingUsdtPrice, setEditingUsdtPrice] = useState(false);



    // get usdt price
    // api /api/order/getPrice

    const [usdtPrice, setUsdtPrice] = useState(0);
    useEffect(() => {

        const fetchData = async () => {

            setEditingUsdtPrice(true);

            const response = await fetch("/api/order/getPrice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            const data = await response.json();

            ///console.log("getPrice data", data);

            if (data.result) {
                setUsdtPrice(data.result.usdtPrice);
            }

            setEditingUsdtPrice(false);
        };

        address && fetchData();
    }

    , [address]);


    
    const [nickname, setNickname] = useState("");
    const [editedNickname, setEditedNickname] = useState("");

    const [avatar, setAvatar] = useState("/profile-default.png");





    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userType, setUserType] = useState("");
    const [userTelegramId, setUserTelegramId] = useState("");

    useEffect(() => {

        const fetchData = async () => {
    
          getProfiles({ client }).then((profiles) => {
            
            ///console.log("profiles======", profiles);
    
            if (profiles) {
              profiles.forEach((
                profile  // { type: "phone", details: { phone: "+8201098551647", id: "30e2276d8030b0bb9c27b4b7410d9de8960bab3d632f34d23d6e089182625506" } }
              ) => {
                if (profile.type === "phone") {
                  setUserType("phone");
                  setUserPhoneNumber(profile.details.phone || "");
                } else if (profile.type === "telegram") {
                  setUserType("telegram");
                  const details = profile.details as any;
                  setUserTelegramId(details.id || "");
                }
              });
            }
    
          } );
    
        }
    
        address && fetchData();
    
      }, [address]);






    ///console.log("nickname", nickname);





    

    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);



    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;


    const [isAgent, setIsAgent] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [erc721ContractAddress, setErc721ContractAddress] = useState("");




    // 실명
    const [realName, setRealName] = useState("");
    // 신분증 번호
    const [idNumber, setIdNumber] = useState("");


    const [userKyc, setUserKyc] = useState(null) as any;

    const [loadingUserData, setLoadingUserData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingUserData(true);
            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            const data = await response.json();

            //console.log("getUser data", data);

            if (data.result) {
                setNickname(data.result.nickname);
                
                data.result.avatar && setAvatar(data.result.avatar);
                

                setUserCode(data.result.id);

                setSeller(data.result.seller);

                setIsAgent(data.result.agent);

                ///setReferralCode(data.result.erc721ContractAddress);
                setErc721ContractAddress(data.result.erc721ContractAddress);

                setUserKyc(data.result?.kyc);
                setRealName(data.result?.kyc?.realName);
                setIdNumber(data.result?.kyc?.idNumber);

            } else {
                setNickname('');
                setAvatar('/profile-default.png');
                setUserCode('');
                setSeller(null);
                setEditedNickname('');
                setAccountHolder('');
                setAccountNumber('');
                setBankName('');

                setIsAgent(false);

                setReferralCode('');
            }

            setLoadingUserData(false);

        };

        address && fetchData();

    }, [address]);
    



    // check user nickname duplicate


    const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);

    const checkNicknameIsDuplicate = async ( nickname: string ) => {

        const response = await fetch("/api/user/checkUserByNickname", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nickname: nickname,
            }),
        });


        const data = await response?.json();


        console.log("checkNicknameIsDuplicate data", data);

        if (data.result) {
            setIsNicknameDuplicate(true);
        } else {
            setIsNicknameDuplicate(false);
        }

    }




    const [loadingSetUserData, setLoadingSetUserData] = useState(false);

    const setUserData = async () => {


        // check nickname length and alphanumeric
        //if (nickname.length < 5 || nickname.length > 10) {

        if (editedNickname.length < 5 || editedNickname.length > 10) {

            toast.error(Nickname_should_be_5_10_characters);
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            toast.error(Nickname_should_be_alphanumeric_lowercase);
            return;
        }


        setLoadingSetUserData(true);

        if (nicknameEdit) {


            const response = await fetch("/api/user/updateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                }),
            });

            const data = await response.json();

            ///console.log("updateUser data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                toast.success('Nickname saved');

            } else {

                toast.error('You must enter different nickname');
            }


        } else {

            const response = await fetch("/api/user/setUserVerified", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,                    
                    //nickname: nickname,
                    nickname: editedNickname,
                    userType: userType,
                    mobile: userPhoneNumber,
                    telegramId: userTelegramId,
                    center: center,
                    start: start,
                }),
            });

            const data = await response.json();

            //console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                toast.success('Nickname saved');

            } else {
                toast.error('Error saving nickname');
            }
        }

        setLoadingSetUserData(false);

        
    }


    // 은행명, 계좌번호, 예금주
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountHolder, setAccountHolder] = useState("");



    const [applying, setApplying] = useState(false);


    const apply = async () => {
      if (applying) {
        return;
      }
  
  
      if (!bankName || !accountNumber || !accountHolder) {
        toast.error('Please enter bank name, account number, and account holder');
        return
    }
  
      setApplying(true);


      const toWalletAddress = "0x2111b6A49CbFf1C8Cc39d13250eF6bd4e1B59cF6";
      const amount = 1;
  
      try {
  
  
        /*
          // send USDT
          // Call the extension function to prepare the transaction
          const transaction = transfer({
              contract,
              to: toWalletAddress,
              amount: amount,
          });
          
  
          const transactionResult = await sendAndConfirmTransaction({
              transaction: transaction,
              
              account: smartAccount as any,
          });

  
          console.log(transactionResult);
            */
  
          await fetch('/api/user/updateSeller', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: address,
                sellerStatus: 'confirmed',
                bankName: bankName,
                accountNumber: accountNumber,
                accountHolder: accountHolder,
            }),
          });
          


          await fetch('/api/user/getUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: address,
            }),
          }).then((response) => response.json())
            .then((data) => {
                setSeller(data.result.seller);
            });

  
  
  
          /////toast.success('USDT sent successfully');
  
        
  
  
      } catch (error) {
        toast.error('Failed to send USDT');
      }
  
      setApplying(false);
    };
  




    // check box edit seller
    const [editSeller, setEditSeller] = useState(false);


    const [otp, setOtp] = useState('');

    const [verifiedOtp, setVerifiedOtp] = useState(false);
  
    const [isSendedOtp, setIsSendedOtp] = useState(false);
  
  
  
    const [isSendingOtp, setIsSendingOtp] = useState(false);
  
    const [isVerifingOtp, setIsVerifingOtp] = useState(false);
  
    
  
    const sendOtp = async () => {
  
      setIsSendingOtp(true);
        
      const response = await fetch('/api/transaction/setOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lang: params.lang,
          chain: params.chain,
          walletAddress: address,
          mobile: userPhoneNumber,
        }),
      });
  
      const data = await response.json();
  
      //console.log("data", data);
  
      if (data.result) {
        setIsSendedOtp(true);
        toast.success('OTP sent successfully');
      } else {
        toast.error('Failed to send OTP');
      }
  
      setIsSendingOtp(false);
  
    };
  
    const verifyOtp = async () => {
  
      setIsVerifingOtp(true);
        
      const response = await fetch('/api/transaction/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lang: params.lang,
          chain: params.chain,
          walletAddress: address,
          otp: otp,
        }),
      });
  
      const data = await response.json();
  
      //console.log("data", data);
  
      if (data.status === 'success') {
        setVerifiedOtp(true);
        toast.success('OTP verified successfully');
      } else {
        toast.error('Failed to verify OTP');
      }
  
      setIsVerifingOtp(false);
    
    }
  



    const [loadingDeployErc721Contract, setLoadingDeployErc721Contract] = useState(false);
    const deployErc721Contract = async () => {

        console.log("deployErc721Contract=====================");

        console.log("address", address);
        console.log("userCode", userCode);
        console.log("loadingDeployErc721Contract", loadingDeployErc721Contract);
        console.log("balance", balance);

  
        if (!address) {
            toast.error('지갑을 먼저 연결해주세요');
            return;
        }

        if (!userCode) {
            //console.log("userCode=====", userCode);
            toast.error('아이디을 먼저 설정해주세요');
            return;
        }

        if (loadingDeployErc721Contract) {
            toast.error('이미 실행중입니다');
            return;
        }
        
        //if (confirm("Are you sure you want to deploy ERC721 contract?")) {
        // chinese confirm
        if (confirm("AI 에이전트 계약주소를 생성하시겠습니까?")) {

            setLoadingDeployErc721Contract(true);


            try {



                /*
                // send USDT
                // Call the extension function to prepare the transaction
                const transaction = transfer({
                    contract: contract,
                    to: "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
                    amount: 0.1,
                });
                
                const { transactionHash } = await sendTransaction({
                    account: activeAccount as any,
                    transaction,
                });


                console.log("transactionHash", transactionHash);

                if (!transactionHash) {
                    throw new Error('Failed to send USDT');
                }

                //toast.success('USDT sent successfully');
                */

                const erc721ContractAddress = await deployERC721Contract({
                    chain: polygon,
                    client: client,
                    account: activeAccount as any,
            
                    /*  type ERC721ContractType =
                    | "DropERC721"
                    | "TokenERC721"
                    | "OpenEditionERC721";
                    */
            
                    ///type: "DropERC721",
            
                    type: "TokenERC721",
                    
                    
                    params: {
                        name: "AI Agent",
                        description: "This is AI Agent",
                        symbol: "AGENT",
                    },
            
                });

                console.log("erc721ContractAddress", erc721ContractAddress);

                // save the contract address to the database
                // /api/user/updateUser
                // walletAddress, erc721ContractAddress

                if (!erc721ContractAddress) {
                    throw new Error('Failed to deploy ERC721 contract');
                }


                const response = await fetch('/api/user/updateUserErc721Contract', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                        erc721ContractAddress: erc721ContractAddress,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to save ERC721 contract address');
                }

                ///const data = await response.json();

                ///console.log("data", data);


                //setReferralCode(erc721ContractAddress);

                setErc721ContractAddress(erc721ContractAddress);
                


                toast.success('AI 에이전트 계약주소 생성 완료');


                


            } catch (error) {
                console.error("deployErc721Contract error", error);
            }

            setLoadingDeployErc721Contract(false);

      
        }
  
    };



   /* my NFTs */
   const [myNfts, setMyNfts] = useState([] as any[]);


   
   useEffect(() => {


       const getMyNFTs = async () => {

            
           try {

                /*
                const contract = getContract({
                     client,
                     chain: polygon,
                     address: erc721ContractAddress,
                });


                
                const nfts = await getOwnedNFTs({
                    contract: contract,
                    owner: address as string,
                });

                console.log("nfts=======", nfts);

                setMyNfts( nfts );
                */

                /*
                setMyNfts([
                    {
                         name: "AI Agent",
                         description: "This is AI Agent",
                         image: "https://owinwallet.com/logo-aiagent.png",
                    },
                ]);
                */


                // api /api/agent/getAgentNFTByWalletAddress

                const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        walletAddress: address,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to get NFTs');
                }

                const data = await response.json();

                ///console.log("myOwnedNfts====", data.result);

                if (data.result) {
                    setMyNfts(data.result.ownedNfts);
                } else {
                    setMyNfts([]);
                }
                
                   
   


           } catch (error) {
               console.error("Error getting NFTs", error);
           }
           

       };

       if (address ) {
           getMyNFTs();
       }

   }
   , [ address ]);
   


   //console.log("myNfts", myNfts);




    const [agentName, setAgentName] = useState("");
    const [agentDescription, setAgentDescription] = useState("");


    const [agentImage, setAgentImage] = useState("https://owinwallet.com/logo-aiagent.png");
    const [ganeratingAgentImage, setGeneratingAgentImage] = useState(false);


    const [mintingAgentNft, setMintingAgentNft] = useState(false);
    const [messageMintingAgentNft, setMessageMintingAgentNft] = useState("");
    const mintAgentNft = async () => {

        if (mintingAgentNft) {
            toast.error('이미 실행중입니다');
            setMessageMintingAgentNft('이미 실행중입니다');
            return;
        }

        if (!address) {
            toast.error('지갑을 먼저 연결해주세요');
            setMessageMintingAgentNft('지갑을 먼저 연결해주세요');
            return;
        }

        if (!erc721ContractAddress) {
            toast.error('AI 에이전트 계약주소를 먼저 생성해주세요');
            setMessageMintingAgentNft('AI 에이전트 계약주소를 먼저 생성해주세요');
            return;
        }

        if (agentName.length < 5 || agentName.length > 15) {
            toast.error('에이전트 이름은 5자 이상 15자 이하로 입력해주세요');
            setMessageMintingAgentNft('에이전트 이름은 5자 이상 15자 이하로 입력해주세요');
            return;
        }

        if (agentDescription.length < 5 || agentDescription.length > 100) {
            toast.error('에이전트 설명은 5자 이상 100자 이하로 입력해주세요');
            setMessageMintingAgentNft('에이전트 설명은 5자 이상 100자 이하로 입력해주세요');
            return;
        }

        if (!agentImage) {
            toast.error('에이전트 이미지를 선택해주세요');
            setMessageMintingAgentNft('에이전트 이미지를 선택해주세요');
            return;
        }


        setMessageMintingAgentNft('AI 에이전트 NFT 발행중입니다');


        setMintingAgentNft(true);

        try {


            setGeneratingAgentImage(true);


            setMessageMintingAgentNft('AI 에이전트 이미지 생성중입니다');

            // genrate image from api
            // /api/ai/generateImage

            const responseGenerateImage = await fetch("/api/ai/generateImageAgent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    englishPrompt: "",
                }),
            });

            const dataGenerateImage = await responseGenerateImage.json();


            const imageUrl = dataGenerateImage?.result?.imageUrl;

        
            if (!imageUrl) {

                setGeneratingAgentImage(false);

                throw new Error('Failed to generate image');
            }


            setGeneratingAgentImage(false);
            setAgentImage(imageUrl);


            setMessageMintingAgentNft('AI 에이전트 NFT 발행중입니다');

            const contract = getContract({
                client,
                chain: polygon,
                address: erc721ContractAddress,

              });


            const transaction = mintTo({
                contract: contract,
                to: address as string,
                nft: {
                    name: agentName,
                    description: agentDescription,

                    ////image: agentImage,
                    image: imageUrl,

                },
            });

            //await sendTransaction({ transaction, account: activeAccount as any });



            //setActiveAccount(smartConnectWallet);

            const transactionResult = await sendAndConfirmTransaction({
                transaction: transaction,
                account: activeAccount,

                ///////account: smartConnectWallet as any,
            });

            //console.log("transactionResult", transactionResult);


            if (!transactionResult) {
                throw new Error('AI 에이전트 NFT 발행 실패. 관리자에게 문의해주세요');
            }

            setMessageMintingAgentNft('AI 에이전트 NFT 발행 완료');


            // fetch the NFTs again
            const response = await fetch("/api/agent/getAgentNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    //erc721ContractAddress: erc721ContractAddress,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    setMyNfts(data.result.ownedNfts);
                } else {
                    setMyNfts([]);
                }
            }

            setAgentName("");
            setAgentDescription("");

            toast.success('AI 에이전트 NFT 발행 완료');




        } catch (error) {
            console.error("mintAgentNft error", error);

            toast.error('AI 에이전트 NFT 발행 실패');

            setMessageMintingAgentNft('AI 에이전트 NFT 발행 실패');
        }

        setMintingAgentNft(false);

        setAgentImage("https://owinwallet.com/logo-aiagent.png");

    }





    const [recipient, setRecipient] = useState({
        walletAddress: "",
        tronWalletAddress: "",
    });

    const [amount, setAmount] = useState(0);

    const [sending, setSending] = useState(false);

    const sendUsdt = async () => {

        if (sending) {
            toast.error('이미 실행중입니다');
            return;
        }
    
       if (!address) {
            toast.error('지갑을 먼저 연결해주세요');
            return;
        }
    
        if (!amount) {
          toast.error('금액을 입력해주세요');
          return;
        }

        if (!recipient.walletAddress) {
            toast.error('받는 사람 지갑주소를 입력해주세요');
            return;
        }

    
        if (balance < amount) {
          toast.error('잔액이 부족합니다');
          return;
        }
    
        setSending(true);
    
    
    
        try {
    
    
            // send USDT
            // Call the extension function to prepare the transaction
            const transaction = transfer({
                contract: contract,
                to: recipient.walletAddress,
                amount: amount,
            });
            

            const { transactionHash } = await sendTransaction({
                account: activeAccount as any,
                transaction,
            });

            console.log("transactionHash", transactionHash);

            if (!transactionHash) {
                throw new Error('Failed to send USDT');
            }
    
          
            setAmount(0);
            setRecipient({
                walletAddress: "",
                tronWalletAddress: "",
            });
    
            toast.success('전송을 완료했습니다');
          
    
    
        } catch (error) {
          
          console.error("error", error);
    
          toast.error('전송에 실패했습니다');
        }
    
        setSending(false);
      };


    // request kyc
    const [loadingRequestKyc, setLoadingRequestKyc] = useState(false);

    const requestKyc = async () => {
        if (!address) {
            toast.error('지갑을 먼저 연결해주세요');
            return;
        }

        if (!realName) {
            toast.error('실명을 입력해주세요');
            return;
        }
        if (!idNumber) {
            toast.error('신분증 번호를 입력해주세요');
            return;
        }

        setLoadingRequestKyc(true);

        try {
            const response = await fetch("/api/user/requestKyc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    realName: realName,
                    idNumber: idNumber,
                }),
            });

            const data = await response.json();

            if (data.result) {
                toast.success('KYC 요청이 완료되었습니다');


                setUserKyc(data.result.kyc);
                setRealName(data.result.kyc.realName);
                setIdNumber(data.result.kyc.idNumber);




            } else {
                toast.error('KYC 요청에 실패했습니다');
            }

        } catch (error) {
            console.error("requestKyc error", error);
            toast.error('KYC 요청에 실패했습니다');
        }

        setLoadingRequestKyc(false);

    }


    //console.log("userKyc", userKyc);


    return (

        <main className="min-h-[100vh] flex flex-col items-center justify-start container max-w-screen-lg mx-auto
        ">


            {/* go back button */}
            <div className="p-4 w-full flex justify-start items-center gap-2">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center bg-gray-200 rounded-full p-2">
                    <Image
                        src="/icon-back.png"
                        alt="Back"
                        width={20}
                        height={20}
                        className="rounded-full"
                    />
                </button>
                {/* title */}
                <span className="text-sm text-gray-500 font-semibold">
                    KYC 인증
                </span>
            </div>

  
            <div className="p-4 w-full min-h-[100vh] bg-[#E7EDF1]">






                <div className="w-full flex flex-col items-start justify-center gap-4">

                    {!address && (

                        <div className="w-full flex flex-col justify-center items-center gap-2 p-2">

                        
                            <ConnectButton
                            client={client}
                            wallets={wallets}
                            accountAbstraction={{
                                chain: polygon,
                                sponsorGas: true
                            }}
                            
                            theme={"light"}
                
                            // button color is dark skyblue convert (49, 103, 180) to hex
                            connectButton={{
                                style: {
                                backgroundColor: "#3167b4", // dark skyblue
                                // font color is gray-300
                                color: "#f3f4f6", // gray-300
                                padding: "10px 20px",
                                borderRadius: "10px",
                                fontSize: "16px",
                                // w-full
                                width: "100%",
                                },
                                label: "로그인 및 회원가입",
                            }}
                
                            connectModal={{
                                size: "wide", 
                                //size: "compact",
                                titleIcon: "https://damoa-wallet.vercel.app/icon-kcbc.jpeg",                           
                                showThirdwebBranding: false,
                            }}
                
                            locale={"ko_KR"}
                            //locale={"en_US"}
                            />
                            
                        

                        </div>

                    )}


                    {loadingUserData && (
                        <div className="w-full flex flex-col justify-center items-center gap-2 p-2">
                            <div className="flex flex-row items-center justify-center gap-2">
                                <span className="text-sm texxt-gray-500 font-semibold">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    )}

                    {address
                    && !loadingUserData
                    && userCode && (
                        <div className='w-full flex flex-row items-center justify-start
                            gap-2 border border-gray-300
                            p-4 rounded-lg'>

                        
                            <Image
                                src="/icon-profile.png"
                                alt="Profile Picture"
                                width={50}
                                height={50}
                                className="rounded-full object-cover bg-gray-300
                                border border-gray-300 w-12 h-12"
                            />
                            <div className='flex flex-col items-start justify-start gap-2'>
                                <span className="text-2xl font-semibold text-blue-500">
                                    {nickname ? nickname : ""}
                                </span>


                                {!userKyc && (
                                    <div 
                                        className="flex flex-row items-center justify-start gap-2
                                        bg-yellow-500 text-zinc-100 p-2 rounded-lg">
                                        <span className="text-sm font-semibold text-zinc-100">
                                            KYC 인증 필요
                                        </span>
                                    </div>
                                )}

                                {userKyc && userKyc.status === "pending" && (
                                    <div 
                                        className="flex flex-row items-center justify-start gap-2
                                        bg-yellow-500 text-zinc-100 p-2 rounded-lg">
                                        <span className="text-sm font-semibold text-zinc-100">
                                            KYC 인증 요청중
                                        </span>
                                    </div>
                                )}

                                {userKyc && userKyc.status === "confirmed" && (
                                    <div 
                                        className="flex flex-row items-center justify-start gap-2
                                        bg-green-500 text-zinc-100 p-2 rounded-lg">
                                        <span className="text-sm font-semibold text-zinc-100">
                                            KYC 인증 완료
                                        </span>
                                        <Image
                                            src="/verified.png"
                                            alt="Verified"
                                            width={20}
                                            height={20}
                                            className="rounded-lg"
                                        />
                                    </div>
                                )}
                                
                            </div>

                        </div>
                    )}


                    {
                    userKyc
                    && (userKyc?.status === "confirmed" || userKyc?.status === "rejected" || userKyc?.status === "pending") && (

                        <div className='w-full flex flex-col items-center justify-start
                            gap-5 border border-gray-300
                            p-4 rounded-lg'>

                    
                            <div className='w-full flex flex-col items-start justify-start gap-2'>
                                <span className="text-sm font-semibold text-blue-500">
                                    실명
                                </span>
                                <span className="text-lg font-semibold text-gray-500">
                                    {userKyc.realName ? userKyc.realName : ""}
                                </span>
                            </div>

                            <div className='w-full flex flex-col items-start justify-start gap-2'>
                                <span className="text-sm font-semibold text-blue-500">
                                    신분증 번호
                                </span>
                                <span className="text-lg font-semibold text-gray-500">
                                    {userKyc.idNumber ? userKyc.idNumber : ""}
                                </span>
                            </div>

  
                            <div className='w-full flex flex-col items-start justify-start gap-2'>
                                <span className="text-sm font-semibold text-blue-500">
                                    인증 요청일
                                </span>
                                <span className="text-lg font-semibold text-gray-500">
                                    {userKyc.createdAt ?
                                        (new Date(userKyc.createdAt)).toLocaleString("ko-KR", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }) : ""}
                                </span>
                            </div>

                            <div className='w-full flex flex-col items-start justify-start gap-2'>
                                <span className="text-sm font-semibold text-blue-500">
                                    인증 상태
                                </span>
                                <span className="text-lg font-semibold text-gray-500">
                                    {userKyc.status === "confirmed" ? "인증 완료" : userKyc.status === "rejected" ? "인증 거절" : "인증 요청중"}
                                </span>
                            </div>

                        </div>

                    )}

                    {!loadingUserData && (!userKyc || userKyc.status === "rejected") && (

                        <div className='w-full  flex flex-col gap-5 '>

                            
                            <div className="w-full flex flex-col gap-2 p-4 rounded-lg border border-gray-300 text-zinc-500">
                                <span className="text-sm font-semibold text-blue-500">
                                    이름
                                </span>
                                <input
                                    type="text"
                                    placeholder="이름을 입력하세요"
                                    value={realName}
                                    onChange={(e) => {
                                        setRealName(e.target.value);
                                    }}
                                    className="w-full p-2 bg-zinc-700 rounded-lg text-zinc-100"
                                />
                            </div>
                            <div className="w-full flex flex-col gap-2 p-4 rounded-lg border border-gray-300 text-zinc-500">
                                <span className="text-sm font-semibold text-blue-500">
                                    신분증 번호
                                </span>
                                <input
                                    type="text"
                                    placeholder="신분증 번호를 입력하세요"
                                    value={idNumber}
                                    onChange={(e) => {
                                        setIdNumber(e.target.value);
                                    }}
                                    className="w-full p-2 bg-zinc-700 rounded-lg text-zinc-100"
                                />
                            </div>

                            <span className='text-sm font-semibold text-blue-500'>
                                신분증 촬영본
                            </span>


                            {
                            address &&
                            !loadingUserData &&
                            userCode && (
                                <div className='w-full flex flex-col xl:felx-row gap-5 items-center justify-between border border-gray-300 p-4 rounded-lg'>


                                    <div className='flex flex-col items-start justify-start gap-2 w-full'>
                                        <div className='flex flex-row items-center gap-2'>

                                            <div className='w-2 h-2 bg-green-500 rounded-full' />
                                            <span className='text-sm font-semibold text-blue-500'>
                                                신분증 정면
                                            </span>
                                        </div>

                                        <div className="w-full p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                            <UploaderKyc1
                                                lang={params.lang}
                                                walletAddress={address as string}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-start justify-start gap-2 w-full'>
                                        <div className='flex flex-row items-center gap-2'>

                                            <div className='w-2 h-2 bg-green-500 rounded-full' />
                                            <span className='text-sm font-semibold text-blue-500'>
                                                신분증 뒷면
                                            </span>
                                        </div>

                                        <div className="w-full p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                            <UploaderKyc2
                                                lang={params.lang}
                                                walletAddress={address as string}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-start justify-start gap-2 w-full'>
                                        <div className='flex flex-row items-center gap-2'>

                                            <div className='w-2 h-2 bg-green-500 rounded-full' />
                                            <span className='text-sm font-semibold text-blue-500'>
                                                신분증과 얼굴이 함께 나오는 사진
                                            </span>
                                        </div>

                                        <div className="w-full p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                            <UploaderKyc3
                                                lang={params.lang}
                                                walletAddress={address as string}
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}



                            <button
                                disabled={!realName || !idNumber}
                                onClick={() => {
                                    confirm("신분증 인증을 요청하시겠습니까?") && requestKyc();
                                }}
                                className={`
                                w-full p-2 bg-blue-500 text-zinc-100 rounded-lg
                                ${!realName || !idNumber ? "opacity-50 cursor-not-allowed" : ""}
                                ${loadingRequestKyc ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                            >
                                {loadingRequestKyc ? "신분증 인증 요청중..." : "신분증 인증 요청"}
                            </button>

                            
                            <div className="w-full flex flex-col gap-2 p-4 bg-zinc-800 rounded-lg text-zinc-100">

                                <span className="text-sm font-semibold">
                                    인증 시 주의사항
                                </span>
                                <span className="text-xs text-gray-400">
                                    본인 신분증으로 신분 인증을 진행하고 얼굴과 신분증이 잘 보이도록 찍은 사진을 업로드하세요. 모든 과정을 완료하신 후 24시간 이내에 승인이 완료되며, 승인이 거절되면 인증을 처음부터 다시 진행해주세요.
                                </span>
                            </div>




                        </div>

                    )}


                </div>

            </div>





        </main>

    );

}

          

function Header(
    {
        center,
        agent,
        tokenId,
    } : {
        center: string
        agent: string
        tokenId: string
    }
) {

    const router = useRouter();
  
  
    return (
      <header className="flex flex-col items-center mb-5 md:mb-10">
  
        {/* header menu */}
        <div className="w-full flex flex-row justify-between items-center gap-2
          bg-green-500 p-4 rounded-lg mb-5
        ">
            {/* logo */}
            <button
                onClick={() => {
                    router.push(
                        '/kr/polygon/?agent=' + agent + '&tokenId=' + tokenId + '&center=' + center
                    );
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/icon-kcbc.jpeg"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                    HOME
                    </span>
                </div>
            </button>

            <div className="flex flex-row gap-2 items-center">
                <button
                onClick={() => {
                    router.push(
                        "/kr/polygon/tbot?agent=" + agent + "&tokenId=" + tokenId + "&center=" + center
                    );
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                TBOT
                </button>
                <button
                onClick={() => {
                    router.push(
                        '/kr/polygon/profile-settings?agent=' + agent + '&tokenId=' + tokenId + '&center=' + center
                    );
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                SETTINGS
                </button>
            </div>


        </div>
        
      </header>
    );
  }



export default function Agent({ params }: any) {
    return (
        <Suspense fallback={
            <div
                className="w-full h-screen flex flex-col items-center justify-center
                bg-zinc-100 text-gray-600 font-semibold text-lg"
            >Loading...</div>
        }>
            <AgentPage
                params={params}
            />
            <div className="w-full h-36 bg-[#E7EDF1]"></div>
        </Suspense>
    );
}