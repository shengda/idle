import { Web3Versions } from '@terminal-packages/sdk';
import FunctionsUtil from '../utilities/FunctionsUtil';
import IdleRebalancerManaged from '../contracts/IdleRebalancerManaged.json';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
const env = process.env;

const globalConfigs = {
  appName: 'Idle',
  version: 'v2.1',
  baseURL: 'https://idle.finance',
  baseToken: 'ETH',
  countries:{
    'USA':'United States of America',
    'GBR':'United Kingdom',
    'AUS':'Australia',
    'BRA':'Brazil',
    'CHN':'China',
    'CAN':'Canada',
    'EUR':'Europe',
    'HKG':'Hong Kong',
    'IND':'India',
    'MEX':'Mexico',
    'RUS':'Russia',
    'ZAF':'South Africa',
    'KOR':'South Korea'
  },
  logs:{ // Enable logs levels
    messagesEnabled:false,
    errorsEnabled:false
  },
  connectors:{ // Connectors props
    metamask:{
      enabled:true,
      subcaption:'Browser extension'
    },
    opera:{
      enabled:true,
      subcaption:'Opera injected wallet'
    },
    dapper:{
      enabled:true,
      subcaption:'Browser extension',
      icon:'dapper.png'
    },
    walletconnect:{
      enabled:true,
      subcaption:'Connect with Walletconnect'
    },
    fortmatic:{
      enabled:true,
      subcaption:'Login with phone-number'
    },
    portis:{
      enabled:true,
      subcaption:'Login with e-mail'
    },
    authereum:{
      enabled:true,
      subcaption:'Cross-device wallet'
    },
    torus:{
      enabled:true,
      icon:'torus.png',
      subcaption:'One-Click login for Web 3.0'
    },
    trezor:{
      enabled:true,
      subcaption:'Hardware wallet'
    },
    ledger:{
      enabled:true,
      subcaption:'Hardware wallet'
    }
  },
  newsletterSubscription:{
    endpoint:'https://dev.lapisgroup.it/idle/newsletter.php'
  },
  analytics:{
    google:{
      events:{
        enabled:true, // Enable Google Analytics events
        addPostfixForTestnet:true, // Append testnet to eventCategory
        debugEnabled:false // Enable sending for test environments
      }
    }
  },
  modals:{ // Enable modals
    first_deposit_referral:false, // Referral share modal
    first_deposit_share:true, // First deposit share modal
    welcome:{ // Welcome modal
      enabled:true,
      frequency:604800 // One week
    }
  },
  dashboard:{
    baseRoute:'/dashboard'
  },
  stats:{
    rates:{
      endpoint:'https://api.idle.finance/rates/',
      TTL:3600 // 1 hour
    },
    tokens:{
      DAI:{
        color:{
          rgb:[250,184,51],
          hex:'#F7B24A',
          hsl:['40', '95%', '59%']
        },
        startTimestamp:'2020-02-11'
      },
      USD:{
        color:{
          hex:'#2875C8',
          rgb:[40,117,200],
          hsl:['211', '67%', '47%']
        },
        startTimestamp:'2020-02-04'
      },
      USDC:{
        color:{
          hex:'#2875C8',
          rgb:[40,117,200],
          hsl:['211', '67%', '47%']
        },
        startTimestamp:'2020-02-04'
      },
      SAI:{
        color:{
          hex:'#F7B24A',
          rgb:[247,178,74],
          hsl:['36', '92%', '63%']
        },
        startTimestamp:'2020-02-04'
      }
    },
    protocols:{
      compound:{
        color:{
          rgb:[0, 209, 146],
          hsl:['162', '100%', '41%']
        }
      },
      fulcrum:{
        color:{
          rgb:[2, 138, 192],
          hsl:['197', '98%', '38%']
        }
      },
      aave:{
        color:{
          rgb:[181, 79, 157],
          hsl:['314', '41%', '51%']
        },
        data:{
          '0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d':{"9599092":"1000000000000000000","9599138":"1000002145381889101","9599263":"1000005780949488577","9599267":"1000005861281670195","9599295":"1000006530716517016","9599299":"1000006653127460435","9599307":"1000006955329476999","9599315":"1000007167635956991","9599579":"1000014516913083792","9599866":"1000021896125356507","9600156":"1000029375473009584","9600433":"1000036761782368503","9600704":"1000047973371697594","9600982":"1000057846491936920","9601051":"1000060938926608487","9601073":"1000062391777748582","9601077":"1000062526730879119","9601345":"1000072656058218520","9601619":"1000086658585392560","9601891":"1000101254172574878","9602144":"1000111557718242572","9602429":"1000118650135683379","9602724":"1000124609651752731","9602993":"1000131604209791550","9603272":"1000143853081496080","9603536":"1000154334098767822","9603826":"1000165274125994199","9603840":"1000165947014542349","9604038":"1000174304224624384","9604182":"1000179960894983285","9604457":"1000189998780664101","9604701":"1000216865312678571","9604979":"1000235800179509973","9605247":"1000252779430052013","9605505":"1000255761151988047","9605793":"1000258800248678697","9606073":"1000261658931061745","9606368":"1000264398260797732","9606639":"1000267023073685248","9606896":"1000269742822963205","9607147":"1000272506968366530","9607406":"1000275312707658371","9607722":"1000278121323348400","9608130":"1000282148341085799","9608395":"1000285002471663108","9608656":"1000287916140260077","9608959":"1000290811576206353","9609544":"1000297063038082624","9609811":"1000300005090400515","9610073":"1000302996616071609","9610341":"1000306145470871182","9610601":"1000309554576923938","9610871":"1000313082061448223","9611120":"1000316604110965591","9611386":"1000320154459968930","9611665":"1000323729165185692","9611949":"1000327312769930414","9612210":"1000330748643637978","9612487":"1000334082725391938","9612758":"1000337163003703118","9613012":"1000339932607884415","9613276":"1000342696700696876","9613542":"1000345453675863417","9613824":"1000348208168016187","9614069":"1000350981643807594","9614327":"1000353775913305334","9614596":"1000356590717650148","9614864":"1000359458343305906","9615111":"1000362482700722209","9615394":"1000365752210523044","9615679":"1000370603502964284","9615958":"1000373830676398292","9616245":"1000377094583147946","9616531":"1000380322319250023","9616803":"1000383248031426907","9617053":"1000386210299715382","9617326":"1000389155509070693"},
          '0x9ba00d6856a4edf4665bca2c2309936572473b7e':{"9598633":"1000000","9598646":"1000001","9598684":"1000002","9598823":"1000003","9598869":"1000004","9598915":"1000005","9599092":"1000008","9599138":"1000009","9599263":"1000011","9599267":"1000011","9599295":"1000012","9599299":"1000012","9599307":"1000012","9599315":"1000012","9599579":"1000017","9599866":"1000022","9600156":"1000026","9600433":"1000031","9600704":"1000036","9600982":"1000042","9601051":"1000044","9601073":"1000045","9601077":"1000045","9601345":"1000053","9601619":"1000058","9601891":"1000063","9602144":"1000068","9602429":"1000073","9602724":"1000078","9602993":"1000083","9603272":"1000088","9603536":"1000093","9603826":"1000098","9603840":"1000098","9604038":"1000102","9604182":"1000104","9604457":"1000109","9604701":"1000114","9604979":"1000119","9605247":"1000124","9605505":"1000129","9605793":"1000134","9606073":"1000139","9606368":"1000144","9606639":"1000149","9606896":"1000153","9607147":"1000158","9607406":"1000163","9607722":"1000168","9608130":"1000175","9608395":"1000180","9608656":"1000185","9608959":"1000190","9609544":"1000260","9609811":"1000293","9610073":"1000314","9610341":"1000331","9610601":"1000332","9610871":"1000333","9611120":"1000335","9611386":"1000336","9611665":"1000337","9611949":"1000339","9612210":"1000340","9612487":"1000341","9612758":"1000343","9613012":"1000344","9613276":"1000346","9613542":"1000347","9613824":"1000349","9614069":"1000351","9614327":"1000353","9614596":"1000355","9614864":"1000356","9615111":"1000358","9615394":"1000360","9615679":"1000361","9615958":"1000363","9616245":"1000365","9616531":"1000367","9616803":"1000369","9617053":"1000371","9617326":"1000373"}
        }
      },
      idle:{
        color:{
          rgb:[0, 55, 255],
          hsl:['227', '100%', '50%']
        }
      }
    }
  },
  contract:{
    methods:{
      redeem:{
        skipRebalance:true
      },
      rebalance:{
        enabled:true,
        abi:IdleRebalancerManaged
      }
    }
  },
  network:{ // Network configurations
    availableNetworks:{
      1:'Mainnet',
      3:'Ropsten',
      4:'Rinkeby',
      42:'Kovan'
    },
    firstBlockNumber:8119247,
    requiredConfirmations: 1,
    accountBalanceMinimum: 0, // in ETH for gas fees
    requiredNetwork: 1, // { 1: Mainnet, 3: Ropsten, 42: Kovan }
    isForked: false, // If TRUE the tx confirmation callback is fired on the receipt
    providers:{
      infura:{
        1: 'https://mainnet.infura.io/v3/',
        42: 'https://kovan.infura.io/v3/'
      },
      etherscan:{
        enabled:true, // False for empty txs list (try new wallet)
        endpoints:{
          1: 'https://api.etherscan.io/api',
          42: 'https://api-kovan.etherscan.io/api'
        }
      },
      terminal:{
        enabled:false,
        supportedNetworks:[1,42],
        params:{
          apiKey: env.REACT_APP_TERMINAL_KEY,
          projectId: env.REACT_APP_TERMINAL_PROJECT_ID,
          source: null,
          web3Version: Web3Versions.one
        }
      },
      simpleID:{
        enabled:true,
        supportedNetworks:[1],
        getNetwork:(networkId,availableNetworks) => {
          let networkName = null;
          switch (networkId){
            case 1:
              networkName = 'mainnet';
            break;
            default:
              networkName = availableNetworks[networkId] ? availableNetworks[networkId].toLowerCase() : 'mainnet';
            break;
          }
          return networkName;
        },
        params:{
          appOrigin: window.location.origin,
          appName: "Idle",
          appId: "eb4d1754-a76e-4c58-8422-54b5ca2395e7",
          renderNotifications: false,
          network: 'mainnet'
        }
      }
    }
  },
  payments: { // Payment methods & providers
    methods:{
      bank:{
        defaultProvider:null,
        showDefaultOnly:false,
        props:{
          imageSrc:'images/bank.png',
          caption:'Bank Account'
        }
      },
      card:{
        defaultProvider:null,
        showDefaultOnly:false,
        props:{
          imageSrc:'images/debit-card.png',
          caption:'Credit Card'
        }
      },
      wallet:{
        defaultProvider:'zeroExInstant',
        showDefaultOnly:false,
        props:{
          imageSrc:'images/ethereum-wallet.svg',
          caption:'Ethereum Wallet',
          imageProps:{
            padding:['0','5px']
          }
        }
      },
    },
    providers: {
      wyre: {
        enabled: true,
        imageSrc: 'images/payments/wyre.svg',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption: '~ 0.75% fee ~',
        supportedMethods:['card'],
        supportedCountries:['USA','GBR','AUS','BRA','CHN','MEX','EUR'],
        supportedTokens:['USDC','DAI','ETH'],
        remoteResources:{},
        env:'prod',
        envParams:{
          test:{
            accountId:'AC_Q2Y4AARC3TP'
          },
          prod:{
            accountId:'AC_PQQBX33XVEQ'
          }
        },
        getInfo: (props) => {
          const info = {};
          if (props.selectedMethod && props.selectedMethod){
            switch (props.selectedMethod){
              case 'bank':
                info.subcaption = `~ 0.75% fee ~\nKYC REQUIRED`;
              break;
              case 'card':
                info.subcaption = `~ 3.2% fee ~\n$250.00/day`;
              break;
              default:
              break;
            }
          }
          return info;
        },
        getInitParams: (props,globalConfigs,buyParams) => {
          const env = globalConfigs.payments.providers.wyre.env;
          const envParams = globalConfigs.payments.providers.wyre.envParams[env];
          const referrerAccountId = envParams.accountId;
          const url = 'https://pay.sendwyre.com/purchase';

          const params = {
            dest: `ethereum:${props.account}`,
            destCurrency: buyParams.selectedToken ? buyParams.selectedToken : ( props.tokenConfig.wyre && props.tokenConfig.wyre.destCurrency ? props.tokenConfig.wyre.destCurrency : props.selectedToken ),
            referrerAccountId,
            redirectUrl:globalConfigs.baseURL
            // failureRedirectUrl:globalConfigs.baseURL
          };

          return `${url}?`+Object.keys(params)
              .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
              .join('&');
        },
        render: (initParams,amount,props,globalConfigs) => {
          const wyreWidget = document.getElementById('wyre-widget');
          if (!wyreWidget){
            const iframeBox = document.createElement("div");
            iframeBox.innerHTML = `
              <div id="wyre-widget" class="wyre-widget iframe-container" style="position:fixed;display:flex;justify-content:center;align-items:center;top:0;left:0;width:100%;height:100%;z-index:999">
                <div id="wyre-widget-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1"></div>
                <a class="wyre-close-button" href="javascript:void(0);" onclick="document.getElementById('wyre-widget').remove();" style="position:absolute;width:30px;height:30px;top:10px;right:10px;font-size:22px;line-height:30px;text-align:center;color:#fff;font-weight:bold;z-index:10;text-decoration:none">✕</a>
                <div id="wyre-widget-container" style="position:relative;z-index:2;width:400px;height:650px">
                  <iframe
                    style="position:relative;z-index:2;"
                    frameborder="0"
                    height="100%"
                    src="${initParams}"
                    width="100%"
                  >
                    <p>Your browser does not support iframes.</p>
                  </iframe>
                  <div id="wyre-widget-loading-placeholder" style="position:absolute;background:#fff;width:100%;height:100%;z-index:1;top:0;display:flex;justify-content:center;align-items:center;">
                    <div style="display:flex;flex-direction:row;align-items:center">
                      <img src="${globalConfigs.payments.providers.wyre.imageSrc}" style="height:50px;" />
                      <h3 style="font-weight:600;font-style:italic;color:#000;padding-left:10px">is loading...</h3>
                    </div>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(iframeBox);

            // Add wyre Widget style (mobile)
            if (!document.getElementById('wyreWidget_style')){
              const wyreStyle = document.createElement('style');
              wyreStyle.id = 'wyreWidget_style';
              wyreStyle.innerHTML = `
              @media (max-width: 40em){
                #wyre-widget {
                  align-items: flex-start !important;
                }
                #wyre-widget-overlay{
                  background:#fff !important;
                }
                #wyre-widget-container{
                  width:100vw;
                  min-height: calc( 100vh - 60px ) !important;
                }
              }`;
              document.body.appendChild(wyreStyle);
            }
          }
        },
      },
      ramp: {
        enabled:true,
        imageSrc: 'images/payments/ramp.png',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption:`~ 2.5% fee ~\nGBP ONLY`,
        supportedMethods:['bank'],
        badge: {
          text:'NO ID REQUIRED',
          color:'#fff',
          bgColor:'#0cade4'
        },
        supportedCountries:['GBR','EUR'],
        supportedTokens:['ETH','DAI'],
        getInitParams: (props,globalConfigs,buyParams) => {
        	return {
	          hostAppName: 'Idle',
	          hostLogoUrl: `${globalConfigs.baseURL}/images/idle-round.png`,
	          swapAsset: buyParams.selectedToken ? buyParams.selectedToken : ( props.tokenConfig.ramp && props.tokenConfig.ramp.swapAsset ? props.tokenConfig.ramp.swapAsset : props.selectedToken ),
	          userAddress: props.account,
	          variant: props.isMobile ? 'mobile' : 'desktop',
        	};
        },
        render: (initParams,amount,props,globalConfigs) => {
          new RampInstantSDK(initParams)
            .on('*', async (event) => {
              const functionsUtil = new FunctionsUtil(props);
              let tokenDecimals = null;
              let tokenAmount = null;

              switch (event.type){
                case 'PURCHASE_SUCCESSFUL':
                  // Update balance
                  props.getAccountBalance();

                  tokenDecimals = await props.getTokenDecimals();

                  tokenAmount = event.payload.purchase.tokenAmount;
                  tokenAmount = functionsUtil.BNify(tokenAmount.toString()).div(functionsUtil.BNify(Math.pow(10,parseInt(tokenDecimals)).toString())).toString();

                  // Toast message
                  window.toastProvider.addMessage(`Payment completed`, {
                    secondaryMessage: `${tokenAmount} ${props.selectedToken} are now in your wallet`,
                    colorTheme: 'light',
                    actionHref: "",
                    actionText: "",
                    variant: "success",
                  });

                break;
                default:
                break;
              }
            })
            .show();
        }
      },
      transak: {
        enabled:true,
        imageSrc: 'images/payments/transak.png',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption:`~ 1.5% fee ~\nGBP ONLY`,
        supportedMethods:['bank'],
        supportedCountries:['GBR','IND','EUR'],
        supportedTokens:['ETH','DAI','USDC'],
        remoteResources:{'https://global.transak.com/v1/widget.js':{}},
        env:'prod',
        badge:{
          text:'INSTANT',
          bgColor:'#0069ee'
        },
        envParams:{
          test:{
            apiKey:env.REACT_APP_TRANSAK_KEY_TEST,
            url:'https://global.transak.com'
          },
          prod:{
            apiKey:env.REACT_APP_TRANSAK_KEY_PROD,
            url:'https://global.transak.com'
          }
        },
        getInfo: (props) => {
          const info = {};
          if (props.selectedCountry && props.selectedCountry.value){
            switch (props.selectedCountry.value.toUpperCase()){
              case 'GBR':
                info.badge = {
                  text:'INSTANT',
                  bgColor:'#0069ee'
                };
                info.subcaption = `~ 1.0% fee ~\nGBP ONLY`;
              break;
              case 'IND':
                info.badge = {
                  text:'INSTANT',
                  bgColor:'#0069ee'
                };
                info.subcaption = `~ 1.0% fee ~\nINR ONLY`;
              break;
              case 'EUR':
                info.badge = {
                  text:'SEPA',
                  color:'#f7cb05 ',
                  bgColor:'#10288a'
                };
                info.subcaption = `~ 1.0% fee ~\nEUR ONLY`;
              break;
              default:
              break;
            }
          }
          return info;
        },
        getInitParams: (props,globalConfigs,buyParams) => {
          const env = globalConfigs.payments.providers.transak.env;
          const envParams = globalConfigs.payments.providers.transak.envParams[env];

          let fiatCurrency = null;

          if (buyParams.selectedCountry && buyParams.selectedCountry.value){
            switch (buyParams.selectedCountry.value.toUpperCase()){
              case 'IND':
                fiatCurrency = 'INR';
              break;
              case 'GBR':
                fiatCurrency = 'GBP';
              break;
              case 'EUR':
                fiatCurrency = 'EUR';
              break;
              default:
                fiatCurrency = 'GBP';
              break;
            }
          }

          let cryptoCurrencyCode = buyParams.selectedToken ? buyParams.selectedToken.toLowerCase() : ( props.tokenConfig.transak && props.tokenConfig.transak.currencyCode ? props.tokenConfig.transak.currencyCode : props.selectedToken);
          cryptoCurrencyCode = cryptoCurrencyCode.toUpperCase();

          const apiKey = envParams.apiKey;
          const walletAddress = props.account;
          const partnerCustomerId = props.account;
          const disableWalletAddressForm = false;

          return {
            apiKey,
            cryptoCurrencyCode,
            walletAddress,
            fiatCurrency,
            partnerCustomerId,
            disableWalletAddressForm,
            width:'100%',
            height:'100%'
            // email,
          };
        },
        render: (initParams,amount,props,globalConfigs) => {
          if (window.transakGlobal){

            const transakWidget = document.getElementById('transak-widget');
            if (!transakWidget){
              const iframeBox = document.createElement("div");
              iframeBox.innerHTML = `
                <div id="transak-widget" class="transak-widget iframe-container" style="position:fixed;display:flex;justify-content:center;align-items:center;top:0;left:0;width:100%;height:100%;z-index:999">
                  <div id="transak-widget-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1" onclick="document.getElementById('transak-widget').remove();"></div>
                  <a class="transak-close-button" href="javascript:void(0);" onclick="document.getElementById('transak-widget').remove();" style="position:absolute;width:30px;height:30px;top:10px;right:10px;font-size:22px;line-height:30px;text-align:center;color:#fff;font-weight:bold;z-index:10;text-decoration:none">✕</a>
                  <div class="transak-widget-container" style="position:relative;z-index:2;width:500px;height:550px">
                    <div id="transak-widget-container" style="position:relative;z-index:2;width:500px;height:550px"></div>
                    <div id="transak-widget-loading-placeholder" style="position:absolute;background:#fff;width:100%;height:100%;z-index:1;top:0;display:flex;justify-content:center;align-items:center;">
                      <div style="display:flex;flex-direction:row;align-items:center">
                        <img src="${globalConfigs.payments.providers.transak.imageSrc}" style="height:50px;" />
                        <h3 style="font-weight:600;font-style:italic;color:#0040ca">is loading...</h3>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              document.body.appendChild(iframeBox);

              // Add transak Widget style (mobile)
              if (!document.getElementById('transakWidget_style')){
                const transakStyle = document.createElement('style');
                transakStyle.id = 'transakWidget_style';
                transakStyle.innerHTML = `
                @media (max-width: 40em){
                  #transak-widget {
                    align-items: flex-start !important;
                  }
                  #transak-widget-overlay{
                    background:#fff !important;
                  }
                  #transak-widget-container{
                    width:100vw;
                    min-height: calc( 100vh - 60px ) !important;
                  }
                }`;
                document.body.appendChild(transakStyle);
              }
            }

            window.transakGlobal.render(initParams, 'transak-widget-container');
          }
        }
      },
      moonpay: {
        enabled:true,
        imageSrc: 'images/payments/moonpay.svg',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption: '~ 4.5% fee ~',
        supportedMethods:['card','bank'],
        supportedCountries:['GBR','EUR','AUS','BRA','CHN','MEX','CAN','HKG','RUS','ZAF','KOR'],
        supportedTokens:['USDC','DAI','ETH'],
        env:'prod',
        envParams:{
          test:{
            url:'https://buy-staging.moonpay.io',
            apiKey:env.REACT_APP_MOONPAY_KEY_TEST
          },
          prod:{
            url:'https://buy.moonpay.io',
            apiKey:env.REACT_APP_MOONPAY_KEY_PROD
          }
        },
        getInfo: (props) => {
          const info = {};
          if (props.selectedMethod && props.selectedMethod){
            switch (props.selectedMethod){
              case 'bank':
                if (props.selectedCountry && props.selectedCountry.value){
                  switch (props.selectedCountry.value.toUpperCase()){
                    case 'EUR':
                      info.badge = {
                        text:'SEPA',
                        color:'#f7cb05 ',
                        bgColor:'#10288a'
                      }
                      info.subcaption = `~ 1.5% fee ~\nEUR ONLY`;
                    break;
                    case 'GBR':
                      info.badge = {
                        text:'GBP',
                      }
                      info.subcaption = `~ 1.5% fee ~\nGBP ONLY`;
                    break;
                    default:
                      info.badge = null;
                      info.subcaption = `~ 1.5% fee ~\nEUR/GBP ONLY`;
                    break;
                  }
                }
              break;
              case 'card':
                info.badge = null;
                info.subcaption = `~ 5% fee ~`;
              break;
              default:
              break;
            }
          }
          return info;
        },
        getInitParams: (props,globalConfigs,buyParams) => {
          const env = globalConfigs.payments.providers.moonpay.env;
          const envParams = globalConfigs.payments.providers.moonpay.envParams[env];
          const apiKey = envParams.apiKey;
          const params = {
            apiKey,
            currencyCode: buyParams.selectedToken ? buyParams.selectedToken.toLowerCase() : ( props.tokenConfig.moonpay && props.tokenConfig.moonpay.currencyCode ? props.tokenConfig.moonpay.currencyCode : props.selectedToken.toLowerCase()),
            walletAddress:props.account,
            baseCurrencyCode:'USD',
            showWalletAddressForm: true
          };

          const methods = {
            'bank':{
              'GBR':'gbp_bank_transfer',
              'EUR':'sepa_bank_transfer'
            },
            'card':'credit_debit_card'
          };

          const selectedCountry = buyParams.selectedCountry && buyParams.selectedCountry.value ? buyParams.selectedCountry.value.toUpperCase() : null;

          // Set payment method
          if (buyParams.selectedMethod){
            switch (buyParams.selectedMethod){
              case 'bank':
                params.enabledPaymentMethods = methods[buyParams.selectedMethod]['EUR'];
                switch (selectedCountry){
                  case 'GBR':
                  case 'EUR':
                    params.enabledPaymentMethods = methods[buyParams.selectedMethod][selectedCountry];
                  break;
                  default:
                    params.enabledPaymentMethods = Object.values(methods[buyParams.selectedMethod]).join(',');
                  break;
                }
              break;
              case 'card':
              default:
                params.enabledPaymentMethods = methods[buyParams.selectedMethod];
              break;
            }
          }

          // Set baseCurrencyCode
          switch (selectedCountry){
            case 'GBR':
              params.baseCurrencyCode = 'GBP';
            break;
            case 'EUR':
              params.baseCurrencyCode = 'EUR';
            break;
            default:
              params.baseCurrencyCode = 'USD';
            break;
          }

          let url = envParams.url;

          // Safari Fix
          var isSafari = navigator.userAgent.indexOf("Safari") > -1;
          if (isSafari) {
            if (!document.cookie.match(/^(.*;)?\s*moonpay-fixed\s*=\s*[^;]+(.*)?$/)) {
              document.cookie = "moonpay-fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/";
              url += "/safari_fix";
            }
          }

          return `${url}?`+Object.keys(params)
              .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
              .join('&');
        },
        render: (initParams,amount,props,globalConfigs) => {
          const moonpayWidget = document.getElementById('moonpay-widget');
          if (!moonpayWidget){
            const iframeBox = document.createElement("div");
            iframeBox.innerHTML = `
              <div id="moonpay-widget" class="moonpay-widget iframe-container" style="position:fixed;display:flex;justify-content:center;align-items:center;top:0;left:0;width:100%;height:100%;z-index:999">
                <div id="moonpay-widget-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1"></div>
                  <div id="moonpay-widget-container" style="position:relative;z-index:2;width:500px;height:490px">
                    <iframe
                      style="position:relative;z-index:2;"
                      frameborder="0"
                      height="100%"
                      src="${initParams}"
                      width="100%"
                    >
                      <p>Your browser does not support iframes.</p>
                    </iframe>
                    <div id="moonpay-widget-loading-placeholder" style="position:absolute;background:#fff;width:100%;height:100%;z-index:1;top:0;display:flex;justify-content:center;align-items:center;">
                      <div style="display:flex;flex-direction:row;align-items:end">
                        <img src="${globalConfigs.payments.providers.moonpay.imageSrc}" style="height:50px;" />
                        <h3 style="padding-left:5px;font-weight:600;font-style:italic;">is loading...</h3>
                      </div>
                    </div>
                    <div id="moonpay-widget-footer" style="position:relative;display:flex;justify-content:center;align-items:center;padding:8px 16px;width:100%;background:#fff;top:-20px;z-index:3">
                      <button style="background:#000;color:#fff;text-align:center;border-radius:5px;width:100%;height:51px;line-height:51px;font-weight:500;border:0;cursor:pointer" onclick="document.getElementById('moonpay-widget').remove();">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            `;
            document.body.appendChild(iframeBox);

            // Add Moonpay Widget style (mobile)
            if (!document.getElementById('moonpayWidget_style')){
              const moonpayStyle = document.createElement('style');
              moonpayStyle.id = 'moonpayWidget_style';
              moonpayStyle.innerHTML = `
              @media (max-width: 40em){
                #moonpay-widget {
                  align-items: flex-start !important;
                }
                #moonpay-widget-overlay{
                  background:#fff !important;
                }
                #moonpay-widget-container{
                  width:100vw;
                  min-height: calc( 100vh - 60px ) !important;
                }
              }`;
              document.body.appendChild(moonpayStyle);
            }
          }
        }
      },
      zeroExInstant: {
        enabled: true,
        imageSrc: 'images/payments/zeroexinstant.svg',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption: '~ 0.25% fee ~',
        supportedMethods:['wallet'],
        supportedTokens:['USDC','DAI'],
        remoteResources:{'https://instant.0x.org/v3/instant.js':{}},
        getInitParams: (props,globalConfigs,buyParams,onSuccess,onClose) => {
          const connectorName = window.RimbleWeb3_context ? window.RimbleWeb3_context.connectorName : null;
          return {
            networkId: globalConfigs.network.requiredNetwork,
            chainId: globalConfigs.network.requiredNetwork,
            provider: connectorName && connectorName!=='Injected' && window.RimbleWeb3_context.connector[connectorName.toLowerCase()] ? window.RimbleWeb3_context.connector[window.RimbleWeb3_context.connectorName.toLowerCase()].provider : window.ethereum,
            orderSource: props.tokenConfig.zeroExInstant.orderSource,
            affiliateInfo: props.tokenConfig.zeroExInstant.affiliateInfo,
            defaultSelectedAssetData: props.tokenConfig.zeroExInstant.assetData,
            availableAssetDatas: [props.tokenConfig.zeroExInstant.assetData],
            shouldDisableAnalyticsTracking: true,
            onSuccess: onSuccess ? onSuccess : () => {},
            onClose: onClose ? onClose : () => {}
          };
        },
        render: (initParams,amount) => {
          if (window.zeroExInstant){
            if (amount){
              initParams.defaultAssetBuyAmount = parseFloat(amount);
            }
            window.zeroExInstant.render(initParams, 'body');
          }
        }
      },
      kyberSwap: {
        enabled: true,
        imageSrc: 'images/payments/kyber.svg',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Swap with',
        captionPos: 'top',
        subcaption: '~ 0.25% fee ~',
        supportedMethods:['wallet'],
        supportedTokens:['USDC','DAI','SAI'],
        web3Subscription:{ // Data for web3 subscription
          enabled: true,
          contractAddress: '0x818e6fecd516ecc3849daf6845e3ec868087b755',
          decodeLogsData: [
            {
              "internalType": "address",
              "name": "_startAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_tokenAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_startAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_tokenAmount",
              "type": "uint256"
            },
          ],
        },
        remoteResources:{
          'https://widget.kyber.network/v0.7.4/widget.css':{},
          'https://widget.kyber.network/v0.7.4/widget.js':{
            parentElement:document.body,
            precall: (props,globalConfigs,providerInfo) => {

              // Remove previous elements
              const buttons = document.querySelectorAll('.kyber-widget-button');
              for (let i=0;i<buttons.length;i++){
                buttons[i].remove();
              }
              const scripts = document.querySelectorAll('.script_kyberSwap');
              for (let i=0;i<scripts.length;i++){
                scripts[i].remove();
              }

              const buttonId = `kyber-swapper-${props.selectedToken}`;
              if (!document.getElementById(buttonId)){
                const a = document.createElement('a');
                a.id = buttonId;
                a.href = providerInfo.getInitParams(props,globalConfigs);
                a.target = '_blank';
                a.rel = 'nofollow noopener noreferrer';
                a.className = 'kyber-widget-button theme-ocean theme-supported';
                a.title = 'Swap with Kyber';
                a.style = 'display:none;';
                document.body.appendChild(a);
              }
            }
          }
        },
        getInitParams: (props,globalConfigs,buyParams) => {
          const params = {
            type:'swap',
            mode:'popup',
            title:`Swap token for ${props.selectedToken}`,
            lang:'en',
            pinnedTokens:props.selectedToken,
            defaultPair:`ETH_${props.selectedToken}`,
            // callback:globalConfigs.baseURL,
            paramForwarding:true,
            network: globalConfigs.network.requiredNetwork === 1 ? 'mainnet' : 'test',
            commissionId:'0x4215606a720477178AdFCd5A59775C63138711e8',
            theme:'theme-ocean'
          };

          const url  = 'https://widget.kyber.network/v0.7.4/';

          return `${url}?`+Object.keys(params)
              .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
              .join('&');
        },
        render: (initParams,amount,props) => {
          const buttonId = `kyber-swapper-${props.selectedToken}`;
          const a = document.getElementById(buttonId);
          if (a){
            a.click();

            // Observe for pending transaction
            if (window.MutationObserver){
              setTimeout(() => {

                const observer = new window.MutationObserver(function(mutations) {
                  mutations.forEach((m,i) => {
                    if (m.addedNodes.length && m.target.className === 'kyber_widget-broadcast'){
                      
                      // Show persistent toast message
                      window.showToastMessage({
                        variant:'processing',
                        message:'Pending deposit',
                        secondaryMessage:'kyberSwap is processing your request'
                      });

                      observer.disconnect();
                    } else if (m.target.id === 'kyber-widget' && m.removedNodes.length && m.removedNodes[0].firstChild.className.includes('kyber_widget-widget-container')) {
                      observer.disconnect();
                    }
                  });
                });
                const target = document.querySelector('#kyber-widget');
                observer.observe(target, { childList: true, subtree: true });
              },1000);
            }
          }
        }
      },
      airSwap: {
        enabled: false,
        imageSrc: 'images/payments/airswap.svg',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption: '~ 0% fee ~',
        supportedMethods:['wallet'],
        supportedTokens:['USDC','DAI','SAI'],
        env:'production',
        remoteResources:{'https://cdn.airswap.io/airswap-instant-widget.js':{}},
        getInitParams: (props,globalConfigs,buyParams,onComplete,onClose) => {
          return {
            env: 'production',
            mode: 'buy',
            token: props.tokenConfig.address,
            baseToken: 'ETH',
            onComplete: onComplete ? onComplete : () => {},
            onClose: onClose ? onClose : () => {}
          };
        },
        render: (initParams,amount,props) => {
          if (window.AirSwapInstant){
            if (amount){
              initParams.amount = amount.toString();
            }
            window.AirSwapInstant.render(initParams,'body');
          }
        }
      },
      totle: {
        enabled: false,
        imageSrc: 'images/payments/totle.svg',
        imageProps: {
          width: ['100%','auto'],
          height: ['auto','35px'],
          my: '8px'
        },
        caption: 'Buy with',
        captionPos: 'top',
        subcaption: '~ 0% fee ~',
        supportedMethods:['wallet'],
        supportedTokens:['USDC','DAI','SAI'],
        env:'production',
        remoteResources:{'https://widget.totle.com/latest/dist.js':{}},
        getInitParams: (props,globalConfigs,buyParams,onComplete,onClose) => {
          return {
            sourceAssetAddress: null,
            sourceAmountDecimal: null,
            destinationAssetAddress: null,
            destinationAmountDecimal: null,
            apiKey: null,
            partnerContractAddress: null,
          };
        },
        render: (initParams,amount,props) => {
          if (window.TotleWidget){
            const nodeId = 'totle-widget';
            if (!document.getElementById(nodeId)){
              const totleWidgetContainer = document.createElement("div");
              totleWidgetContainer.id = nodeId;
              document.body.appendChild(totleWidgetContainer);
            }

            window.TotleWidget.default.run(initParams,document.getElementById(nodeId));
          }
        }
      }
    }
  }
};

export default globalConfigs;