'use client';
import React, { useEffect, useState, Suspense, use } from "react";

import { toast } from 'react-toastify';


import { client } from "../../../client";

import {
    getContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { deployERC721Contract } from 'thirdweb/deploys';

/*
import {
    getOwnedNFTs,
    mintTo,
    transferFrom,
} from "thirdweb/extensions/erc721";
*/
// erc1155
import {
    safeTransferFrom,
    claimTo,
    getOwnedNFTs,
} from "thirdweb/extensions/erc1155";





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

    AutoConnect,

    useIsAutoConnecting,
    useAutoConnect,

} from "thirdweb/react";

import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";

import Link from "next/link";

import {
    inAppWallet,
    createWallet,
  } from "thirdweb/wallets";

import Image from 'next/image';

//import Uploader from '@/components/uploader';

import {
    allowance,
    approve,
    balanceOf
} from "thirdweb/extensions/erc20";




import {
    useRouter,
    useSearchParams,
} from "next//navigation";
import { token } from "thirdweb/extensions/vote";
import { N } from "ethers";


const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon



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
  



    const account = useActiveAccount();


    const contract = getContract({
        client,
        chain: polygon,
        address: contractAddress,
    });
    

    


    const router = useRouter();



    const address = account?.address;
  
    // test address
    //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";
  









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



    
    const [nickname, setNickname] = useState("");
    const [editedNickname, setEditedNickname] = useState("");

    const [avatar, setAvatar] = useState("/profile-default.png");



    

    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);



    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;


    const [isAgent, setIsAgent] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [erc721ContractAddress, setErc721ContractAddress] = useState("");

    const [userCenter, setUserCenter] = useState("");

    const [isCenterOwner, setIsCenterOwner] = useState(false);

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

            //console.log("data", data);



            if (data.result) {
                setNickname(data.result.nickname);
                
                data.result.avatar && setAvatar(data.result.avatar);
                

                setUserCode(data.result.id);

                setSeller(data.result.seller);

                setIsAgent(data.result.agent);

                ///setReferralCode(data.result.erc721ContractAddress);
                setErc721ContractAddress(data.result.erc721ContractAddress);

                setUserCenter(data.result.center);

                setIsCenterOwner(
                    data.result.centerOwner === true
                );

            } else {
                setNickname('');
                setAvatar('/profile-default.png');
                setUserCode('');
                setSeller(null);
                setEditedNickname('');
                
                //setAccountHolder('');

                //setAccountNumber('');
                //setBankName('');

                setIsAgent(false);

                setReferralCode('');

                setErc721ContractAddress('');

                setUserCenter('');
            }
            setLoadingUserData(false);

        };

        address &&
        fetchData();

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


        //console.log("checkNicknameIsDuplicate data", data);

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

            //toast.error("아이디는 5자 이상 10자 이하로 입력해주세요");
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            //toast.error("아이디는 영문 소문자와 숫자만 입력해주세요");
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

                //toast.success('Nickname saved');

            } else {

                //toast.error('You must enter different nickname');
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
                    userType: "",
                    mobile: "",
                    telegramId: "",
                }),
            });

            const data = await response.json();

            //console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                //toast.success('Nickname saved');

            } else {
                //toast.error('Error saving nickname');
            }
        }

        setLoadingSetUserData(false);

        
    }




    const erc1155ContractAddress = "0x796f8867E6D474C1d63e4D7ea5f52B48E4bA83D6";

    const [price, setPrice] = useState(0);

    // claim NFT
    const [claimingNft, setClaimingNft] = useState(false);
    const [messageClaimingNft, setMessageClaimingNft] = useState("");
    const claimNft = async (contractAddress: string, tokenId: string) => {

        if (claimingNft) {
            //toast.error('이미 실행중입니다');
            setMessageClaimingNft('이미 실행중입니다.');
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            setMessageClaimingNft('지갑을 먼저 연결해주세요.');
            return;
        }

        
        if (balance < price) {
            //toast.error('USDT 잔액이 부족합니다');
            setMessageClaimingNft('USDT 잔액이 부족합니다.');
            return;
        }
        


        setMessageClaimingNft('NFT 발행중입니다.');

        setClaimingNft(true);

        let allowanceAmount = 0;

        try {

            const erc1155Contract = getContract({
                client,
                chain: polygon,
                address: contractAddress,
            });


            // // ERC20: transfer amount exceeds allowance

            const result =
            await allowance({
                contract: contract,
                owner: address as string,
                spender: erc1155ContractAddress,
            });

            //console.log("result", result);
            allowanceAmount = Number(result);

            if (allowanceAmount < price * 10 ** 6) {
                
                //throw new Error('USDT 토큰을 먼저 채굴 NFT 발행 계약에 승인해주세요');

                // approve

                const transactionApprove = approve({
                    contract: contract,
                    spender: erc1155ContractAddress,
                    amount: price * 10 ** 6,
                });

                const transactionResultApprove = await sendAndConfirmTransaction({
                    account: account as any,
                    transaction: transactionApprove,
                });

                if (!transactionResultApprove) {
                    throw new Error('USDT 토큰을 먼저 채굴 NFT 발행 계약에 승인해주세요.');
                }

            }



            const transaction = claimTo({
                contract: erc1155Contract,


                tokenId: BigInt(tokenId),

                


                to: address as string,
                ///amount: 1n,

                quantity: 1n,

            });

            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,
            });

            if (!transactionResult) {
                throw new Error('NFT 발행 실패. 관리자에게 문의해주세요.');
            }

            setMessageClaimingNft('NFT 발행을 완료했습니다.');

            alert('NFT 발행을 완료했습니다.');

            
            // fetch the NFTs again

            /*
            setLoadingOwnedNfts(true);
            const nfts = await getOwnedNFTs({
                contract: erc1155Contract,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);
            */
            // /api/snowball/getAgentNFTByWalletAddress

            setLoadingOwnedNfts(true);
            const response = await fetch("/api/snowball/getAgentNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });
            const data = await response.json();
            //console.log("data", data);
            if (data.result) {
                setOwnedNfts(data.result.ownedNfts);
            } else {
                setOwnedNfts([]);
            }
            setLoadingOwnedNfts(false);









        } catch (error) {

            if (error instanceof Error) {
                setMessageClaimingNft('NFT 발행 실패:' + error.message
                    + " allowanceAmount: " + allowanceAmount);

                //alert('NFT 발행 실패:' + error.message);

                // ERC20: transfer amount exceeds allowance

            } else {
                setMessageClaimingNft('NFT 발행 실패: 알 수 없는 오류');

                //alert('NFT 발행 실패: 알 수 없는 오류');
            }
        }

        setClaimingNft(false);


    }



    const [ownedNfts, setOwnedNfts] = useState([] as any[]);
    const [loadingOwnedNfts, setLoadingOwnedNfts] = useState(false);

    /*
    useEffect(() => {
        const fetchOwnedNFTs = async () => {

            setLoadingOwnedNfts(true);
            const contractErc1155 = getContract({
                client,
                chain: polygon,
                address: erc1155ContractAddress,
            });

            const nfts = await getOwnedNFTs({
                contract: contractErc1155,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);

        };

        if (address) {
            fetchOwnedNFTs();
        }
    }, [address, erc1155ContractAddress]);
    */

    // // /api/snowball/getAgentNFTByWalletAddress
    useEffect(() => {
        const fetchOwnedNFTs = async () => {

            setLoadingOwnedNfts(true);
            const response = await fetch("/api/snowball/getAgentNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });
            const data = await response.json();
            //console.log("data", data);
            if (data.result) {
                setOwnedNfts(data.result.ownedNfts);
            } else {
                setOwnedNfts([]);
            }
            setLoadingOwnedNfts(false);

        };

        if (address) {
            fetchOwnedNFTs();
        }
    }, [address]);


    //console.log("ownedNfts", ownedNfts);


    // safeTransferFrom
    // transfer NFT
    /*
    const [transferringNft, setTransferringNft] = useState(false);
    const [messageTransferringNft, setMessageTransferringNft] = useState("");

    const [toAddress, setToAddress] = useState("");
    const [sendAmount, setSendAmount] = useState("");
    */

    // array of transferingNft
    // array of messageTransferringNft
    // array of toAddress
    // array of sendAmount
    // array of tokenId

    const [transferringNft, setTransferringNft] = useState([] as boolean[]);
    useEffect(() => {
        setTransferringNft(ownedNfts.map(() => false));
    } , [ownedNfts]);

    const [messageTransferringNft, setMessageTransferringNft] = useState([] as string[]);
    useEffect(() => {
        setMessageTransferringNft(ownedNfts.map(() => ""));
    } , [ownedNfts]);

    const [toAddress, setToAddress] = useState([] as string[]);
    useEffect(() => {
        setToAddress(ownedNfts.map(() => ""));
    } , [ownedNfts]);

    const [sendAmount, setSendAmount] = useState([] as string[]);
    useEffect(() => {
        setSendAmount(ownedNfts.map(() => ""));
    } , [ownedNfts]);


    /*
    const [tokenId, setTokenId] = useState([] as string[]);
    useEffect(() => {
        setTokenId(ownedNfts.map(() => ""));
    } , [ownedNfts]);
    */
    //const [tokenId, setTokenId] = useState("");

        




    



    const transferNft = async (
        index: number,
        tokenId: string,
    ) => {

    
        if (transferringNft[index]) {
            //toast.error('이미 실행중입니다');
            messageTransferringNft[index] = '이미 실행중입니다.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (!address) {
            //toast.error('지갑을 먼저 연결해주세요');
            messageTransferringNft[index] = '지갑을 먼저 연결해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (!toAddress[index]) {
            //toast.error('수신자 주소를 입력해주세요');
            messageTransferringNft[index] = '수신자 주소를 입력해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (!sendAmount[index]) {
            //toast.error('전송할 양을 입력해주세요');
            messageTransferringNft[index] = '전송할 양을 입력해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (Number(sendAmount[index]) <= 0) {
            //toast.error('전송할 양을 입력해주세요');
            messageTransferringNft[index] = '전송할 양을 입력해주세요.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }

        if (Number(sendAmount[index]) > Number(ownedNfts[index].balance)) {
            //toast.error('보유한 양보다 많이 전송할 수 없습니다');
            messageTransferringNft[index] = '보유한 양보다 많이 전송할 수 없습니다.';
            setMessageTransferringNft([...messageTransferringNft]);
            return;
        }



        setTransferringNft(transferringNft.map((value, i) => i === index ? true : value));
    
        

        try {

            const erc1155Contract = getContract({
                client,
                chain: polygon,
                address: erc1155ContractAddress,
            });

            const optionalData = '0x';
            const transaction = safeTransferFrom({
                contract: erc1155Contract,
                from: address as string,
                to: toAddress[index],
                tokenId: BigInt(tokenId),
                value: BigInt(sendAmount[index]),
                data: optionalData,
            });


            const transactionResult = await sendAndConfirmTransaction({
                account: account as any,
                transaction: transaction,
            });

            if (!transactionResult) {
                throw new Error('NFT 전송 실패. 관리자에게 문의해주세요.');
            }

            //setMessageTransferringNft('NFT 전송을 완ㄹ했습니다.');

            messageTransferringNft[index] = 'NFT 전송을 완료했습니다.';
            setMessageTransferringNft([...messageTransferringNft]);

            alert('NFT 전송을 완료했습니다.');

            //setSendAmount('');
            //setToAddress('');

            setSendAmount(sendAmount.map(() => ""));
            setToAddress(toAddress.map(() => ""));

            


            // fetch the NFTs again
            /*
            setLoadingOwnedNfts(true);
            const nfts = await getOwnedNFTs({
                contract: erc1155Contract,
                start: 0,
                count: 10,
                address: address as string,
            });
            setOwnedNfts(nfts);
            setLoadingOwnedNfts(false);
            */
            // /api/snowball/getAgentNFTByWalletAddress
            setLoadingOwnedNfts(true);
            const response = await fetch("/api/snowball/getAgentNFTByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });
            const data = await response.json();
            //console.log("data", data);
            if (data.result) {
                setOwnedNfts(data.result.ownedNfts);
            } else {
                setOwnedNfts([]);
            }
            setLoadingOwnedNfts(false);






            // fetch transfers again
            /*
            setLoadingTransfers(true);
            const response = await fetch("/api/wallet/getTransfersByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    limit: 2,
                    page: 0,
                    walletAddress: address,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setTransfers(data.result?.transfers);
            }
            setLoadingTransfers(false);
            */


        } catch (error) {

            if (error instanceof Error) {
                messageTransferringNft[index] = 'NFT 전송 실패:' + error.message;
                setMessageTransferringNft([...messageTransferringNft]);

                //setMessageTransferringNft('NFT 전송 실패:' + error.message);

                //alert('NFT 전송 실패:' + error.message);

            } else {
                messageTransferringNft[index] = 'NFT 전송 실패: 알 수 없는 오류';
                setMessageTransferringNft([...messageTransferringNft]);

                //setMessageTransferringNft('NFT 전송 실패: 알 수 없는 오류');

                //alert('NFT 전송 실패: 알 수 없는 오류');
            }

        }


        setTransferringNft(transferringNft.map((value, i) => i === index ? false : value));



    }



    // /api/wallet/getTransfersByWalletAddress
    /*
    const [transfers, setTransfers] = useState([] as any[]);
    const [loadingTransfers, setLoadingTransfers] = useState(false);
    useEffect(() => {
        const fetchTransfers = async () => {
            setLoadingTransfers(true);

            const response = await fetch("/api/wallet/getTransfersByWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    limit: 2,
                    page: 0,
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                setLoadingTransfers(false);
                return;
            }

            const data = await response.json();

            console.log("data", data);

            if (data.result) {
                setTransfers(data.result?.transfers);
            } else {
                setTransfers([]);
            }

            setLoadingTransfers(false);
        };

        if (address) {
            fetchTransfers();
        }
    } , [address]);
    */

    /*
    {
        "_id": "67a85ce3537afb93e116d201",
        "user": {
            "_id": "67860b48c7ec01ab07b82a95",
            "telegramId": "441516803",
            "walletAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440"
        },
        "sendOrReceive": "send",
        "transferData": {
            "transactionHash": "0x58348ae8a94819d950b41a89b1f8b3fc7cfce424f377b1a1ca7c5a85f4123d2c",
            "transactionIndex": 19,
            "fromAddress": "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
            "toAddress": "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C",
            "value": "1000000",
            "timestamp": 1739087064000,
            "_id": "67a85ce3537afb93e116d200"
        }
    }   
    */

    /* 서비스 죵료 */
    
    /*
    return (

        <main

           
            className="p-4 pb-28 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto
                bg-zinc-900 bg-opacity-90 backdrop-blur-md
                rounded-lg shadow-xl"
        >
            <div className="w-full text-center text-4xl text-white font-bold">
                서비스 종료
            </div>
        </main>

    )
    */
    

    // snowbot is 300 or 3000
    const [snowbot, setSnowbot] = useState(300);

    useEffect(() => {

        if (snowbot === 300) {
            setPrice(300);
        } else {
            setPrice(3000);
        }

    }, [snowbot]);


    return (

        <main className="
        p-4 min-h-[100vh] flex-col items-start justify-center container max-w-screen-lg mx-auto
        bg-[#E7EDF1]
        ">


            <div className="py-0 w-full">

                {/*
                <AutoConnect
                    client={client}
                    wallets={[wallet]}
                    timeout={15000}
                />
                */}



        
                <div className="w-full flex flex-col items-start justify-center gap-2">

                    {!address && (

                        <div className="
                            mt-16
                            w-full flex flex-col justify-center items-center gap-2 p-2">

                        
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
                    


                    {/* 회원아이디를 만들어주세요 */}
                    {
                    !loadingUserData
                    && address && !userCode && (

                        <div className="w-full flex flex-col justify-start items-start gap-2 p-2">
                            {/* 회원아이디를 만들어주세요 */}

                            <div className="flex flex-row justify-center items-center gap-2">
                            {/* dot */}
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <h2 className="text-sm md:text-lg font-semibold text-zinc-800">
                                회원아이디를 만들어주세요. 회원아이디가 없으면 서비스를 이용할 수 없습니다.
                            </h2>
                            </div>

                            <button
                            onClick={() => {

                                router.push(
                                "/" + params.lang + "/" + params.chain + "/my-page" + "?start=" + start
                                );

                            }}
                            className="w-full bg-[#3167b4] text-white px-4 py-2 rounded-lg hover:bg-[#3167b4]"
                            >
                            회원아이디 설정하기
                            </button>

                        </div>


                    )}




                
                    {/* radio box for snowbot 300 or 3000 */}
                    {/*
                    <div className="w-full flex flex-row gap-2 items-center justify-start">
                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <input
                                type="radio"
                                id="snowbot300"
                                name="snowbot"
                                value="300"
                                checked={snowbot === 300}
                                onChange={() => setSnowbot(300)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="snowbot300" className="text-sm text-zinc-800 font-semibold">
                                {snowbot === 300 ? "SNOW BOT 300" : "SNOW BOT 3000"}
                            </label>
                        </div>

                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                            <input
                                type="radio"
                                id="snowbot3000"
                                name="snowbot"
                                value="3000"
                                checked={snowbot === 3000}
                                onChange={() => setSnowbot(3000)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="snowbot3000" className="text-sm text-zinc-800 font-semibold">
                                SNOW BOT 3000
                            </label>
                        </div>

                    </div>
                    */}





                    {/* claim NFT */}
                    {address && (
                        <div className="mt-5 w-full flex flex-col gap-2 items-center justify-between">

                            {/*
                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-xl text-zinc-800 font-bold">
                                    {snowbot === 300 ? "SNOW BOT 300" : "SNOW BOT 3000"}
                                </div>
                            </div>
                            */}

                            {/* nft image */}
                            {/* logo-snowball-3000.png */}
                            {/*
                            <div className="w-full flex flex-col gap-2 items-center justify-between">
                                <Image
                                    //src="/logo-snowbot3000.png"
                                    src={snowbot === 300 ? "/logo-snowbot300.png" : "/logo-snowbot3000.png"}
                                    alt="NFT"
                                    width={300}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            */}

                            {/* select image */}
                            <div className="w-full grid grid-cols-2 gap-2 items-center justify-between">

                                <button
                                    onClick={() => setSnowbot(300)}
                                    className={`w-full flex flex-col gap-2 items-center justify-between
                                    ${snowbot === 300 ? "border border-blue-500" : "border border-gray-200"}
                                    p-2 rounded-lg
                                    ${snowbot === 300 ? "bg-white" : "bg-gray-200"}
                                    `}
                                >
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        SNOW BOT 300
                                    </span>
                                    <Image
                                        src="/logo-snowbot300.png"
                                        alt="NFT"
                                        width={300}
                                        height={300}
                                        className="rounded-lg"
                                    />
                                    {/* 가격: 300 USDT */}
                                    {/* 일일 포인트: 0.45 */}
                                    {/* APR: 54% */}

                                    <div className="w-full flex flex-col gap-2 items-center justify-between">

                                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                                            <span className="w-12 text-xs text-gray-500 text-left">
                                                가격
                                            </span>
                                            <span className="w-full text-sm text-gray-800 font-semibold text-right">
                                                300 USDT
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                                            <span className="w-full text-xs text-gray-500 text-left">
                                                일일포인트
                                            </span>
                                            <span className="w-full text-sm text-gray-800 font-semibold text-right">
                                                0.45
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                                            <span className="w-full text-xs text-gray-500 text-left">
                                                APR
                                            </span>
                                            <span className="w-full text-sm text-gray-800 font-semibold text-right">
                                                54%
                                            </span>
                                        </div>

                                    </div>

                                </button>

                                <button
                                    onClick={() => setSnowbot(3000)}
                                    className={`w-full flex flex-col gap-2 items-center justify-between
                                    ${snowbot === 3000 ? "border border-blue-500" : "border border-gray-200"}
                                    p-2 rounded-lg
                                    ${snowbot === 3000 ? "bg-white" : "bg-gray-200"}
                                    `}
                                >
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        SNOW BOT 3000
                                    </span>
                                    <Image
                                        src="/logo-snowbot3000.png"
                                        alt="NFT"
                                        width={300}
                                        height={300}
                                        className="rounded-lg"
                                    />
                                    {/* 가격: 3,000 USDT */}
                                    {/* 일일 포인트: 4.5 */}
                                    {/* APR: 54% */}
                                    <div className="w-full flex flex-col gap-2 items-center justify-between">

                                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                                            <span className="w-12 text-xs text-gray-500 text-left">
                                                가격
                                            </span>
                                            <span className="w-full text-sm text-gray-800 font-semibold text-right">
                                                3,000 USDT
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                                            <span className="w-full text-xs text-gray-500 text-left">
                                                일일포인트
                                            </span>
                                            <span className="w-full text-sm text-gray-800 font-semibold text-right">
                                                4.5
                                            </span>
                                        </div>

                                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                                            <span className="w-full text-xs text-gray-500 text-left">
                                                APR
                                            </span>
                                            <span className="w-full text-sm text-gray-800 font-semibold text-right">
                                                54%
                                            </span>
                                        </div>
                                    </div>

                                </button>

                            </div>




                            {/* usdt balance */}
                            {address && (

                                <div className="mt-5 w-full flex flex-col gap-2 items-center justify-between">


                                    <div className='w-full flex flex-col gap-2 items-start justify-start'>
                                        <span className="text-sm  text-zinc-800 font-semibold">
                                            나의 잔고
                                        </span>
                        

                                        <div className="w-full flex flex-row items-center justify-end gap-1
                                            bg-white
                                            border border-gray-200
                                            p-2 rounded-lg
                                            shadow-sm
                                            ">
                                            <span className="text-2xl text-gray-500 font-semibold">
                                                {
                                                    Number(balance).toFixed(2).split('.')[0]
                                                }.
                                            </span>
                                            <span className="text-lg text-gray-500 font-semibold">
                                                {
                                                    Number(balance).toFixed(2).split('.')[1]
                                                }
                                            </span>
                                            <span className="text-lg text-zinc-500 font-semibold">
                                                USDT
                                            </span>
                                        </div>

                                    </div>


   



                                <div className="w-full flex flex-col gap-2 items-center justify-center">

                                    {price > balance ? (
                                        <span className="text-sm text-red-500">
                                            USDT 잔액이 부족합니다.
                                        </span>
                                    ) : (
                                        <span className="text-sm text-green-500">
                                            구매후 USDT 잔액: {(balance - price).toFixed(2)} USDT
                                        </span>
                                    )}



                                    {/*
                                                      backgroundColor: "#3167b4", // dark skyblue
                                        // font color is gray-300
                                        color: "#f3f4f6", // gray-300
                                        */}

                                    <button

                                        disabled={claimingNft}
                                        onClick={() => {
                                            if (confirm("구매하시겠습니까?")) {
                                                claimNft(
                                                    erc1155ContractAddress,
                                                    snowbot === 300 ? "0" : "1"
                                                );
                                            }
                                        }}
                                        className={`
                                            ${claimingNft ? 'bg-gray-300 text-gray-400' : 'bg-[#3167b4] text-[#f3f4f6]'}
                                            w-full p-2 rounded-lg text-sm
                                            hover:bg-[#2b5b9f] hover:text-[#e2e8f0]
                                            transition-all duration-300 ease-in-out
                                        
                                        `}
                                    >
                                        <div className="flex flex-row gap-2 items-center justify-center">
                                            {claimingNft && (
                                                <Image
                                                    src="/loading.png"
                                                    alt="loding"
                                                    width={30}
                                                    height={30}
                                                    className="animate-spin"
                                                />
                                            )}
                                            {claimingNft && '구매중...'}
                                            {!claimingNft && '구매하기'}
                                        </div>
                                    </button>
                                </div>

                                {messageClaimingNft && (
                                <span className="text-lg text-red-500 font-semibold">
                                    {messageClaimingNft}
                                </span>
                                )}


                                </div>
                            )}





                            <div className="mt-5 w-full flex flex-col gap-5 items-start justify-between
                                border border-gray-200
                                rounded-lg">

                                {/*
                                ‘Snow Bot 300’은 해당 봇을 구매한 사용자들에게 특별한 혜택을 제공하는 스페셜 멤버십 NFT입니다. 구매와 동시에 ‘Snowball 프로젝트’의 멤버가 되며, 이 Bot을 기반으로 다양한 보상과 혜택을 누릴 수 있습니다.
                                */}

                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        {`
                                            SNOW BOT ${snowbot}은 해당 봇을 구매한 사용자들에게 특별한 혜택을 제공하는 스페셜 멤버십 NFT입니다. 구매와 동시에 ‘Snowball 프로젝트’의 멤버가 되며, 이 Bot을 기반으로 다양한 보상과 혜택을 누릴 수 있습니다.
                                        `}
                                    </span>
                                </div>

                                {/*
                                ‘Snow Bot 300’을 구매하면 해당 Bot의 정책에 따른 멤버십 리워드를 획득할 수 있습니다. 획득한 리워드는 외부 지갑으로 자유롭게 출금하거나 ‘Snowball 프로젝트’와 함께하는 다양한 제휴사에서 사용할 수 있습니다. 지금 바로 Snow Bot으로 Snowball을 굴려보세요!
                                */}
                                <div className="w-full flex flex-row gap-2 items-center justify-start">
                                    {/* dot */}
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        {`
                                            SNOW BOT ${snowbot}을 구매하면 해당 Bot의 정책에 따른 멤버십 리워드를 획득할 수 있습니다. 획득한 리워드는 외부 지갑으로 자유롭게 출금하거나 ‘Snowball 프로젝트’와 함께하는 다양한 제휴사에서 사용할 수 있습니다. 지금 바로 Snow Bot으로 Snowball을 굴려보세요!
                                        `}
                                    </span>
                                </div>

                                {/*
                                기간별 구매 리워드
                                    봇 구매 후 보유한 기간별로 받을 수 있는 리워드 혜택입니다. (단위 USDT)

                                    // Snow Bot 300
                                    1일 → 0.45 USDT
                                    30일 → 13.5 USDT
                                    365일 → 164.25 USDT

                                    // Snow Bot 3000
                                    1일 → 4.5 USDT
                                    30일 → 135 USDT
                                    365일 → 1642.5 USDT
                                */}
                                <div className="w-full flex flex-col gap-2 items-start justify-between">
                                    <div className="w-full flex flex-row gap-2 items-center justify-start">
                                        {/* dot */}
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-lg text-zinc-800 font-bold">
                                            기간별 구매 리워드
                                        </span>
                                    </div>

                                    <span className="text-sm text-zinc-800 font-semibold">
                                        봇 구매 후 보유한 기간별로 받을 수 있는 리워드 혜택입니다. (단위 USDT)
                                    </span>
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        1일 → {snowbot === 300 ? "0.45" : "4.5"} USDT
                                    </span>
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        30일 → {snowbot === 300 ? "13.5" : "135"} USDT
                                    </span>
                                    <span className="text-sm text-zinc-800 font-semibold">
                                        365일 → {snowbot === 300 ? "164.25" : "1642.5"} USDT
                                    </span>
                                </div>





                            </div>

                        </div>
                    )}




                    {/* if not centerOwner show message */}
                    {/* NFT를 발행받을려면 센터장에게 문의하세요. */}
                    {/*
                    {address && userCode && !isCenterOwner && (
                        <div className='w-full flex flex-col gap-2 items-center justify-between
                            border border-gray-800
                            p-4 rounded-lg'>
                            <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                                AI 에이전트 NFT 발행
                            </div>
                            <span className='text-lg font-semibold'>
                                AI 에이전트 NFT를 발행받을려면 센터장에게 문의하세요.
                            </span>
                        </div>
                    )}
                        */}


                    {/* if centerOwner show message */}
                    {/* AI 에이전트 계약주소 생성하기 */}
                    {/*
                        address && userCode && !erc721ContractAddress && isCenterOwner && (
                    <>



                        {address && userCode && !erc721ContractAddress && (

    
                            <button
                                disabled={loadingDeployErc721Contract}
                                onClick={deployErc721Contract}
                                className={`
                                    ${loadingDeployErc721Contract ? 'bg-gray-300 text-gray-400' : 'bg-green-500 text-zinc-100'}
                                    p-2 rounded-lg text-sm font-semibold
                                `}
                            >
                                <div className='flex flex-row gap-2 items-center justify-center'>

                                    {address && loadingDeployErc721Contract && (
                                        <Image
                                            src="/loading.png"
                                            alt="loding"
                                            width={30}
                                            height={30}
                                            className='animate-spin'
                                        />
                                    )}
                                    {address && loadingDeployErc721Contract && 'AI 에이전트 계약주소 생성중...'}
                                    {address && !erc721ContractAddress && !loadingDeployErc721Contract && 'AI 에이전트 계약주소 생성하기'}
    
                                </div>

                            </button>

                        )}

                    </>
                    )*/}



                    {/* owned NFTs */}
                    <div className="mt-5 w-full flex flex-col gap-2 items-center justify-between">
                        <div className="w-full flex flex-row gap-2 items-center justify-start">
                            {/* dot */}
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="text-sm text-zinc-800 font-bold">
                                소유한 SNOW BOT
                            </div>
                        </div>

                        {loadingOwnedNfts && (
                            <div className="w-full flex flex-row gap-2 items-center justify-center">
                                <Image
                                    src="/loading.png"
                                    alt="loding"
                                    width={30}
                                    height={30}
                                    className="animate-spin"
                                />
                                <span className="text-lg font-semibold text-zinc-400">
                                    SNOW BOT 불러오는 중...
                                </span>
                            </div>
                        )}

 
                        {ownedNfts.length === 0 && !loadingOwnedNfts && (
                            <div className="w-full flex flex-row gap-2 items-center justify-center">
                                <span className="text-lg font-semibold text-zinc-400">
                                    소유한 SNOW BOT 이 없습니다.
                                </span>
                            </div>
                        )}


                        {!loadingOwnedNfts && ownedNfts.length > 0 && (
                            <div className="w-full flex flex-col gap-10 items-center justify-between">
                                {ownedNfts.map((nft, index) => (

                                    <div key={index} className="w-full flex flex-col gap-2 items-center justify-between p-4
                                        border border-gray-800
                                        rounded-lg">


                                        <div className="text-xl text-zinc-800 font-bold">
                                            {nft.name}
                                        </div>
                                        
                                        <div className="text-4xl text-green-500 font-semibold">
                                            {
                                                // nft.quantityOwned is bigint
                                                nft.balance
                                            }개
                                        </div>

                                        <div className="w-full flex flex-col gap-2 items-center justify-between">


                                                {nft.tokenId === "0" ? (
                                                    <Image
                                                        src="/logo-snowbot300.png"
                                                        alt="NFT"
                                                        width={300}
                                                        height={300}
                                                        className="rounded-lg"
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/logo-snowbot3000.png"
                                                        alt="NFT"
                                                        width={300}
                                                        height={300}
                                                        className="rounded-lg"
                                                    />
                                                )}

 
                                        </div>


                                        {/* transfer NFT */}
                                        <div className="mt-5 w-full flex flex-col gap-2 items-center justify-between">
                                            
                                            <div className="w-full flex flex-row gap-2 items-center justify-start
                                                border-b border-gray-200
                                                rounded-lg">
                                                <span className="text-sm text-zinc-800 font-bold">
                                                    NFT 전송
                                                </span>
                                            </div>

                                            {/*
                                            채굴 NFT를 전송하면 소유자의 모든 권리를 이전하는 것에 동의하는 것입니다.
                                            */}
                                            <div className="w-full flex flex-row gap-2 items-center justify-start">
                                                {/* dot */}
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span className="text-sm text-red-500">
                                                    NFT를 전송하면 소유자의 모든 권리를 이전하는 것에 동의하는 것입니다.
                                                </span>
                                            </div>


                                            <span className="text-sm text-zinc-400 font-semibold">
                                               NFT를 전송받을 주소와 수량을 입력하세요.
                                            </span>




                                            <input
                                                className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                placeholder="주소"
                                                type='text'
                                                onChange={(e) => {
                                                    //setToAddress(e.target.value);
                                                    //toAddress[index] = e.target.value;

                                                    setToAddress(toAddress.map((value, idx) => {
                                                        if (idx === index) {
                                                            return e.target.value;
                                                        } else {
                                                            return value;
                                                        }
                                                    }));

                                                }}
                                                value={
                                                    toAddress[index]
                                                }
                                            />
                                            <input
                                                className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-lg font-semibold"
                                                placeholder="수량"
                                                type='number'
                                                onChange={(e) => {

                                                    //setSendAmount(e.target.value);
                                                    //sendAmount[index] = e.target.value;

                                                    setSendAmount(sendAmount.map((value, idx) => {
                                                        if (idx === index) {
                                                            return e.target.value;
                                                        } else {
                                                            return value;
                                                        }
                                                    }));

                                                    
                                                }}
                                                value={
                                                    sendAmount[index]
                                                }

                                            />
                                            <button
                                                /*
                                                disabled={
                                                    transferringNft
                                                    || !toAddress
                                                    || !sendAmount
                                                    || Number(sendAmount) > Number(nft.quantityOwned.toString())
                                                }
                                                */
                                                disabled={transferringNft[index]
                                                    || !toAddress[index]
                                                    || !sendAmount[index]
                                                    || Number(sendAmount[index]) > Number(nft.balance)
                                                }


                                                
                                                onClick={() =>
                                                    confirm("채굴 NFT를 전송하시겠습니까?") &&
                                                    
                                                    transferNft(
                                                        index,
                                                        nft.tokenId,
                                                    )
                                                }

                                                className={`
                                                    ${transferringNft[index] ? 'bg-gray-300 text-gray-400' : 'bg-[#3167b4] text-[#f3f4f6]'}
                                                    w-full p-2 rounded-lg text-sm
                                                    hover:bg-[#2b5b9f] hover:text-[#e2e8f0]
                                                    transition-all duration-300 ease-in-out
                                                `}

                                            >

                                                <div className="flex flex-row gap-2 items-center justify-center">
                                                    {transferringNft[index] && (
                                                        <Image
                                                            src="/loading.png"
                                                            alt="loding"
                                                            width={30}
                                                            height={30}
                                                            className="animate-spin"
                                                        />
                                                    )}
                                                    {transferringNft[index] && 'NFT 전송중...'}
                                                    {!transferringNft[index] && 'NFT 전송하기'}
                                                </div>


                                            </button>

                                            {messageTransferringNft[index] && (
                                                <span className="text-lg text-green-500 font-semibold">
                                                    {messageTransferringNft[index]}
                                                </span>
                                            )}

                                        </div>




                                    </div>
                                ))}
                            </div>
                        )}

                    </div>





                </div>

            </div>




          {true && (

            <div className="w-full fixed bottom-0 left-0 right-0 items-center justify-center">


              <div className="w-full grid grid-cols-4 gap-0 justify-center items-center p-0
                bg-zinc-100 rounded-lg text-center
              ">

                {/* logo */}

                {/* home */}
                <button
                  onClick={() => {
                    router.push(
                      "/" + params.lang + "/" + params.chain + "/"
                      + "?start=" + start
                    );
                  }}
                  // selected state
                  className="flex flex-col justify-center items-center gap-0
                    hover:bg-blue-200 hover:text-blue-800
                    transition duration-300 ease-in-out
                    transform hover:-translate-y-1
                    p-2
                  "
                >
                  <Image
                    src="/icon-home.png"
                    alt="Home"
                    width={35}
                    height={35}
                    className="rounded-lg w-5 h-5 xl:w-10 xl:h-10"
                  />
                  <p className="text-xs md:text-lg text-gray-600 font-bold">
                    홈
                  </p>
                </button>

                {/* NFT 상점 */}
                {/* selected state */}
                <button
                    /*
                  onClick={() => {
                    router.push(
                      "/" + params.lang + "/" + params.chain + "/my-nft-snowball"
                    );
                  }}
                    */
                  className="flex flex-col justify-center items-center gap-0
                    bg-blue-200 text-blue-800
                    transition duration-300 ease-in-out
                    transform hover:-translate-y-1
                    p-2
                  "
                >
                  <Image
                    src="/icon-shopping-cart.png"
                    alt="NFT Market"
                    width={35}
                    height={35}
                    className="rounded-lg w-5 h-5 xl:w-10 xl:h-10"
                  />
                  <p className="text-xs md:text-lg text-gray-600 font-bold">
                    NFT 상점
                  </p>
                </button>

                {/* 친구 초대 */}
                <button
                  onClick={() => {
                    router.push(
                      "/" + params.lang + "/" + params.chain + "/affiliation-kcbc"
                      + "?start=" + start
                    );
                  }}
                  className="flex flex-col justify-center items-center gap-0
                    hover:bg-blue-200 hover:text-blue-800
                    transition duration-300 ease-in-out
                    transform hover:-translate-y-1
                    p-2
                  "
                >
                  <Image
                    src="/icon-invite.png"
                    alt="Invite Friend"
                    width={35}
                    height={35}
                    className="rounded-lg w-5 h-5 xl:w-10 xl:h-10"
                  />
                  <p className="text-xs md:text-lg text-gray-600 font-bold">
                    친구초대
                  </p>
                </button>

                {/* 마이페이지 */}
                <button
                  onClick={() => {
                    router.push(
                      "/" + params.lang + "/" + params.chain + "/my-page"
                        + "?start=" + start
                    );
                  }}
                  className="flex flex-col justify-center items-center gap-0
                    hover:bg-blue-200 hover:text-blue-800
                    transition duration-300 ease-in-out
                    transform hover:-translate-y-1
                    p-2
                  "
                >
                  <Image
                    src="/icon-my-page.png"
                    alt="My Page"
                    width={35}
                    height={35}
                    className="rounded-lg w-5 h-5 xl:w-10 xl:h-10"
                  />
                  <p className="text-xs md:text-lg text-gray-600 font-bold">
                    마이페이지
                  </p>
                </button>

              </div>

            </div>

          )}




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
      
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/logo-aiagent.png"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                    AI Agent
                    </span>
                </div>


            {/*}
            <div className="flex flex-row gap-2 items-center">
                <button
                onClick={() => {
                    router.push(
                        "/tbot?center=" + center + "agent=" + agent + "&tokenId=" + tokenId
                    );
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                TBOT
                </button>
                <button
                onClick={() => {
                    router.push('/profile?center=' + center + 'agent=' + agent + '&tokenId=' + tokenId);
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
                >
                SETTINGS
                </button>
            </div>
            */}


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
            {/* bg-[#E7EDF1] */}
            <div className="w-full h-36 bg-[#E7EDF1]"></div>

        </Suspense>
    );
  }