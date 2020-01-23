import React, { Component } from 'react';
import { Image, Flex, Box, Heading, Link, Text, Card, Icon } from 'rimble-ui'
import styles from './Landing.module.scss';
import LandingForm from '../LandingForm/LandingForm';
import Faq from '../Faq/Faq';
import NewsletterForm from '../NewsletterForm/NewsletterForm';
import EquityChart from '../EquityChart/EquityChart';
// import DefiScoreTable from '../DefiScoreTable/DefiScoreTable';
import Footer from '../Footer/Footer';
import FunctionsUtil from '../utilities/FunctionsUtil';
import availableTokens from '../configs/availableTokens';
import Confetti from 'react-confetti';

let scrolling = false;
let scrollTimeoutID;
let componentUnmounted;

class Landing extends Component {
  state = {
    activeCarousel:1,
    carouselIntervalID:null,
    startCarousel:null,
    setActiveCarousel:null,
    activeBullet:null,
    updatingAllocations:false,
    testPerformed:false,
    protocolsAprs:null,
    protocolsAllocations:null,
    runConfetti:false
  };

  // Clear all the timeouts
  async componentWillUnmount(){
    componentUnmounted = true;
    // console.log('Landing.js componentWillUnmount');
    var id = window.setTimeout(function() {}, 0);

    while (id--) {
        // console.log('componentWillUnmount - Clear timeoutID',id);
        window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
  }

  // Utils
  functionsUtil = null;
  loadUtils(){
    if (this.functionsUtil){
      this.functionsUtil.setProps(this.props);
    } else {
      this.functionsUtil = new FunctionsUtil(this.props);
    }
  }

  async componentDidMount(){

    this.loadUtils();

    window.setConfetti = this.setConfetti;

    componentUnmounted = false;
    scrollTimeoutID = null;

    window.onscroll = async () => {
      if (componentUnmounted){
        return false;
      }
      if (scrollTimeoutID){
        window.clearTimeout(scrollTimeoutID);
      }
      scrollTimeoutID = window.setTimeout( async () => {
        scrolling = true;
        this.processScrolling();
      },150);
    };

    const startCarousel = async () => {
      if (!this.props.isMobile){
        if (this.state.carouselIntervalID){
          window.clearTimeout(this.state.carouselIntervalID);
        }
        const carouselIntervalID = window.setTimeout( async () => setActiveCarousel(this.state.activeCarousel+1) ,6500);
        this.setState({
          carouselIntervalID
        });
      }
    }

    const setActiveCarousel = (activeCarousel) => {
      activeCarousel = activeCarousel<=3 ? activeCarousel : 1;
      this.setState({activeCarousel});
      startCarousel();
    }

    this.setState({startCarousel,setActiveCarousel});

    if (!this.props.isMobile && !this.state.carouselIntervalID){
      startCarousel();
    }

    // Load aprs and allocations
    if (!this.state.protocolAllocation && !this.state.updatingAllocations){
      await this.getAprs();
      await this.getAllocations();
    }
  }

  async componentDidUpdate(prevProps, prevState) {

    this.loadUtils();

    const selectedTokenChanged = prevProps.selectedToken !== this.props.selectedToken;
    const prevContract = (prevProps.contracts.find(c => c.name === this.props.tokenConfig.idle.token) || {}).contract;
    const contract = (this.props.contracts.find(c => c.name === this.props.tokenConfig.idle.token) || {}).contract;
    const contractChanged = contract && prevContract !== contract;
    
    if (!this.state.updatingAllocations && (contractChanged || selectedTokenChanged)) {
      await this.getAprs();
      await this.getAllocations();
    }
  }

  processScrolling = () => {
    if (scrolling){

      const bulletCards = document.getElementsByClassName('bulletCard');
      let activeBullet = 0;

      for (let i=0;i<bulletCards.length;i++){
        const bulletCard = bulletCards[i];
        const offsetY = bulletCard.offsetTop ? bulletCard.offsetTop : bulletCard.offsetParent.offsetTop;
        if (window.scrollY >= offsetY-200){
          activeBullet = i+2;
        }
      }
      scrolling = false;

      if (parseInt(activeBullet) !== parseInt(this.state.activeBullet)){
        this.setState({activeBullet});
      }
    }
  };

  getAllocations = async () => {
    const protocolsAllocations = {};
    let totalAllocation = 0;

    this.setState({
      updatingAllocations:true
    });

    await this.functionsUtil.asyncForEach(this.props.tokenConfig.protocols,async (protocolInfo,i) => {
      const contractName = protocolInfo.token;
      const protocolAddr = protocolInfo.address;

      const contractLoaded = this.functionsUtil.getContractByName(contractName);
      if (!contractLoaded){
        return;
      }

      let [protocolBalance, tokenDecimals, exchangeRate] = await Promise.all([
        this.functionsUtil.getProtocolBalance(contractName),
        this.functionsUtil.getTokenDecimals(contractName),
        ( protocolInfo.functions.exchangeRate ? this.functionsUtil.genericContractCall(contractName,protocolInfo.functions.exchangeRate.name,protocolInfo.functions.exchangeRate.params) : null )
      ]);

      if (!protocolBalance){
        return false;
      }

      if (exchangeRate && protocolInfo.functions.exchangeRate.decimals){
        exchangeRate = this.functionsUtil.fixTokenDecimals(exchangeRate,protocolInfo.functions.exchangeRate.decimals);
      }

      const protocolAllocation = this.functionsUtil.fixTokenDecimals(protocolBalance,tokenDecimals,exchangeRate);
      totalAllocation += protocolAllocation;

      this.functionsUtil.customLog('getAllocations', contractName, protocolBalance, tokenDecimals, protocolAllocation.toString());

      protocolsAllocations[protocolAddr] = protocolAllocation;
    });

    this.setState({
      protocolsAllocations,
      totalAllocation,
      updatingAllocations: false
    });

    return protocolsAllocations;
  }

  getAprs = async () => {
    const Aprs = await this.functionsUtil.genericIdleCall('getAPRs');

    if (this.state.updatingAprs){
      return false;
    }

    this.setState({
      updatingAprs:true
    });

    if (!Aprs){
      setTimeout(() => {
        this.getAprs();
      },5000);

      this.setState({
        updatingAprs:false
      });
      return false;
    }

    const addresses = Aprs.addresses.map((addr,i) => { return addr.toString().toLowerCase() });
    const aprs = Aprs.aprs;
    const currentProtocol = '';
    const maxRate = Math.max(...aprs);
    const currentRate = maxRate;
    const protocolsAprs = {};

    this.props.tokenConfig.protocols.forEach((info,i) => {
      // const protocolName = info.name;
      const protocolAddr = info.address.toString().toLowerCase();
      const addrIndex = addresses.indexOf(protocolAddr);
      if ( addrIndex !== -1 ) {
        const protocolApr = aprs[addrIndex];
        protocolsAprs[protocolAddr] = (+this.functionsUtil.toEth(protocolApr)).toFixed(2);
      }
    });

    const state = {
      protocolsAprs,
      maxRate: aprs ? ((+maxRate).toFixed(2)) : '0.00',
      currentProtocol,
      currentRate: currentRate ? (+this.functionsUtil.toEth(currentRate)).toFixed(2) : null,
      updatingAprs: false
    };
    this.setState(state);
    return state;
  };

  startLending = async e => {
    this.props.updateSelectedTab(e, '1');
    window.location.href = '#invest';
  }

  // VanillaJS function for smooth scroll
  scrollTo = (to, duration) => {
      const start = window.scrollY;
      const change = to - start;
      const increment = 20;
      let currentTime = 0;

      Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
      };
          
      const animateScroll = () => {
          currentTime += increment;
          var val = Math.easeInOutQuad(currentTime, start, change, duration);
          window.scrollTo(0,val);
          if(currentTime < duration) {
            window.setTimeout(animateScroll, increment);
          }
      };
      
      animateScroll();
  }

  setConfetti = (runConfetti) => {
    this.setState({
      runConfetti
    })
  }

  render() {
    const { network } = this.props;
    const maxOpacity = 0.5;
    const minOpacity = 0.1;
    const idleOpacity = maxOpacity;

    return (
      <Box
        style={{
          paddingBottom: !network.isCorrectNetwork ? "8em" : "0"
        }}
      >
        <Confetti
          style={{ position: 'fixed','zIndex':9999 }}
          run={this.state.runConfetti}
          recycle={false}
          numberOfPieces={500}
          width={window.innerWidth}
          height={window.innerHeight}
          onConfettiComplete={confetti => {
            this.setConfetti(false);
            confetti.reset()
          }}
        />
        <Box className={[styles.headerContainer]} px={[3,5]} pt={['2.5em', '3em']}>
          <Box position={'relative'} zIndex={10}>
            <Flex flexDirection={'column'} alignItems={'center'} maxWidth={["50em", "70em"]} mx={'auto'} pb={3} textAlign={'center'} pt={['8vh', '8vh']}>
              <Heading.h1 fontFamily={'sansSerif'} lineHeight={'1.1em'} mb={'0.2em'} fontSize={['1.6em','3.5rem']} textAlign={'center'} color={'white'}>
                Always the best yield, with no effort
              </Heading.h1>
              <Heading.h2 fontWeight={'400'} lineHeight={['1.4em', '2em']} fontSize={[2,3]} textAlign={'center'} color={'white'}>
                Maximize your lending returns by investing in a single token
              </Heading.h2>
            </Flex>
            <Flex flexDirection={'column'} alignItems={'center'} maxWidth={["50em", "50em"]} mx={'auto'} textAlign={'center'}>
              <LandingForm
                mintCallback={ () => this.setConfetti(true) }
                getAllocations={this.getAllocations}
                openBuyModal={this.props.openBuyModal}
                getAprs={this.getAprs}
                selectedToken={this.props.selectedToken}
                tokenConfig={this.props.tokenConfig}
                setSelectedToken={this.props.setSelectedToken}
                accountBalanceToken={this.props.accountBalanceToken}
                getAccountBalance={this.props.getAccountBalance}
                isMobile={this.props.isMobile}
                updateSelectedTab={this.props.updateSelectedTab}
                selectedTab={this.props.selectedTab} />
            </Flex>
            <Flex flexDirection={'column'} py={[3,4]} mb={[3,5]} alignItems={'center'}>
              <Link onClick={(e) => {this.scrollTo(document.getElementById('how-it-works').offsetTop,300)}} textAlign={'center'} color={'dark-gray'} hoverColor={'dark-gray'} fontSize={2} fontWeight={3}>
                <Flex flexDirection={'column'} py={[2,1]} alignItems={'center'}>
                  <Box>
                    How it works
                  </Box>
                  <Box>
                    <Icon
                      className={styles.bounceArrow}
                      align={'center'}
                      name={'KeyboardArrowDown'}
                      color={'dark-gray'}
                      size={"2em"}
                    />
                  </Box>
                </Flex>
              </Link>
            </Flex>
          </Box>
        </Box>

        <Box id='how-it-works' p={[3,0]}>
          <Flex flexDirection={['column','column']} alignItems={'center'} justifyContent={'center'}>
            <Flex alignItems={'center'} flexDirection={'column'} width={1} maxWidth={['24em','90em']}>
              <Flex flexDirection={['column','row']} height={['auto','275px']}>
                <Flex width={[1,1/2]} justifyContent={['center','flex-end']} alignItems={['center','start']}>
                  <Flex flexDirection={['column','row']} position={'relative'} className={['bulletCard',styles.bulletCard,styles.bulletCardFirst,this.state.activeBullet>=1 ? styles.bulletCardActive :null]} width={[1,5/7]} p={[3,4]}>
                    {
                      !this.props.isMobile && (
                        <Flex width={1/4} p={[2,2]} alignItems={'center'} justifyContent={'center'}>
                          <Image width={1} src={'images/lend.png'} />
                        </Flex>
                      )
                    }
                    <Box width={[1,3/4]} pl={[0,2]}>
                      <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} mb={[2,2]} color={'blue'}>
                        Lend Your Idle Assets
                      </Heading.h3>
                      {
                        this.props.isMobile && (
                          <Flex width={1} p={[2,2]} alignItems={'center'} justifyContent={'center'}>
                            <Image width={1/5} src={'images/lend.png'} />
                          </Flex>
                        )
                      }
                      <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5}>
                        Connect your wallet and <strong>lend some idle assets to get started</strong>.
                        Get Idle Tokens back which will track the best rate on the market.
                      </Heading.h4>
                    </Box>
                  </Flex>
                </Flex>
                <Flex position={'relative'} width={[1,1/2]} zIndex={'-1'}>
                  <Flex width={[1,6/8]} alignItems={['center','flex-end']}>
                    <Box className={[styles.bentTube,styles.bentTubeRight,this.state.activeBullet>=2 ? styles.bentTubeActive : null]} position={'relative'} width={1/2} height={['120px','175px']} borderRadius={[0,'0 50px 0 0']} borderTop={[0,'15px solid rgba(0,54,255,0.1)']} borderRight={['10px solid rgba(0,54,255,0.1)','15px solid rgba(0,54,255,0.1)']}>
                      <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,!this.props.isMobile ? styles.bulletLeft : styles.bulletTop]}></Text>
                      <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,styles.bulletBottom]}></Text>
                    </Box>
                  </Flex>
                </Flex>
              </Flex>

              <Flex flexDirection={['column','row']} justifyContent={'flex-end'} height={['auto','275px']}>
                {
                  !this.props.isMobile && (
                    <Flex width={[1,1/2]} justifyContent={['center','flex-end']} zIndex={'-1'}>
                      <Flex width={[1,6/8]} justifyContent={['center','flex-end']} alignItems={['center','flex-end']}>
                        <Box className={[styles.bentTube,styles.bentTubeLeft,this.state.activeBullet>=3 ? styles.bentTubeActive : null]} position={'relative'} width={1/2} height={['120px','175px']} borderRadius={'50px 0 0 0'} borderTop={'15px solid rgba(0,54,255,0.1)'} borderLeft={'15px solid rgba(0,54,255,0.1)'}>
                          <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,!this.props.isMobile ? styles.bulletRight : styles.bulletTop]}></Text>
                          <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,styles.bulletBottomLeft]}></Text>
                        </Box>
                      </Flex>
                    </Flex>
                  )
                }
                <Flex width={[1,1/2]} justifyContent={'flex-start'} alignItems={'start'}>
                  <Flex flexDirection={['column','row']} position={'relative'} className={['bulletCard',styles.bulletCard,this.state.activeBullet>=2 ? styles.bulletCardActive :null]} width={[1,5/7]} p={[3,4]}>
                    <Box width={[1,3/4]} pl={[0,2]}>
                      <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} mb={[2,2]} color={'blue'}>
                        Instantly Earn Interest
                      </Heading.h3>
                      {
                        this.props.isMobile && (
                          <Flex width={1} p={[2,2]} alignItems={'center'} justifyContent={'center'}>
                            <Image width={1/5} src={'images/earn-interests.png'} />
                          </Flex>
                        )
                      }
                      <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5}>
                        Your funds will be automatically allocated into the best <strong>available deal</strong>. You will immediately start earning compounded interest.
                      </Heading.h4>
                    </Box>
                    {
                      !this.props.isMobile && (
                        <Flex width={1/4} p={[2,2]} alignItems={'center'} justifyContent={'center'}>
                          <Image width={1} src={'images/earn-interests.png'} />
                        </Flex>
                      )
                    }
                  </Flex>
                </Flex>
                {
                  this.props.isMobile && (
                    <Flex width={[1,1/2]}>
                      <Flex width={[1,6/8]} alignItems={['center','flex-end']}>
                        <Box className={[styles.bentTube,this.state.activeBullet>=3 ? styles.bentTubeActive : null]} position={'relative'} width={1/2} height={['120px','175px']} borderRadius={[0,'0 50px 0 0']} borderTop={[0,'15px solid rgba(0,54,255,0.1)']} borderRight={['10px solid rgba(0,54,255,0.1)','15px solid rgba(0,54,255,0.1)']}>
                          <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,!this.props.isMobile ? styles.bulletLeft : styles.bulletTop]}></Text>
                          <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,styles.bulletBottom]}></Text>
                        </Box>
                      </Flex>
                    </Flex>
                  )
                }
              </Flex>

              <Flex flexDirection={['column','row']} height={['auto','275px']}>
                <Flex width={[1,1/2]} justifyContent={['center','flex-end']} alignItems={['center','start']}>
                  <Flex flexDirection={['column','row']} position={'relative'} className={['bulletCard',styles.bulletCard,this.state.activeBullet>=3 ? styles.bulletCardActive :null]} width={[1,5/7]} p={[3,4]}>
                    {
                      !this.props.isMobile && (
                        <Flex width={1/4} p={[2,2]} alignItems={'center'} justifyContent={'center'}>
                          <Image width={1} src={'images/decentralized-rebalance.png'} />
                        </Flex>
                      )
                    }
                    <Box width={[1,3/4]} pl={[0,2]}>
                      <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} mb={[2,2]} color={'blue'}>
                        User Based Rebalance
                      </Heading.h3>
                      {
                        this.props.isMobile && (
                          <Flex width={1} p={[2,2]} alignItems={'center'} justifyContent={'center'}>
                            <Image width={1/5} src={'images/decentralized-rebalance.png'} />
                          </Flex>
                        )
                      }
                      <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5}>
                        Every interaction with Idle <strong>rebalances the entire pool</strong> if needed.
                        You always have the power to rebalance on behalf of all users. One for all, all for one.
                      </Heading.h4>
                    </Box>
                  </Flex>
                </Flex>
                <Flex width={[1,1/2]} zIndex={'-1'}>
                  <Flex width={[1,6/8]} alignItems={['center','flex-end']}>
                    <Box className={[styles.bentTube,styles.bentTubeRight,this.state.activeBullet>=4 ? styles.bentTubeActive : null]} position={'relative'} width={1/2} height={['120px','175px']} borderRadius={[0,'0 50px 0 0']} borderTop={[0,'15px solid rgba(0,54,255,0.1)']} borderRight={['10px solid rgba(0,54,255,0.1)','15px solid rgba(0,54,255,0.1)']}>
                      <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,!this.props.isMobile ? styles.bulletLeft : styles.bulletTop]}></Text>
                      <Text position={'absolute'} display={'block'} className={[styles.bulletPoint,styles.bulletBottom]}></Text>
                    </Box>
                  </Flex>
                </Flex>
              </Flex>

              <Flex flexDirection={['column','row']} justifyContent={'flex-end'} height={['auto','275px']}>
                <Flex width={[1,1/2]} justifyContent={'flex-end'}>
                  
                </Flex>
                <Flex width={[1,1/2]} justifyContent={['center','flex-start']} alignItems={['center','start']}>
                  <Flex flexDirection={['column','row']} position={'relative'} className={['bulletCard',styles.bulletCard,this.state.activeBullet>=4 ? styles.bulletCardActive :null]} width={[1,5/7]} p={[3,4]}>
                    <Box width={[1,3/4]} pl={[0,2]}>
                      <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} mb={[2,2]} color={'blue'}>
                        Redeem At Any Time
                      </Heading.h3>
                      {
                        this.props.isMobile && (
                          <Flex width={1} p={2} alignItems={'center'} justifyContent={'center'}>
                            <Image width={1/5} src={'images/redeem.png'} />
                          </Flex>
                        )
                      }
                      <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5}>
                        You can <strong>always redeem back your funds and earn interest</strong>, automatically rebalancing the pool if needed. Kudos for you.
                      </Heading.h4>
                    </Box>
                    {
                      !this.props.isMobile && (
                        <Flex width={1/4} p={2} alignItems={'center'} justifyContent={'center'}>
                          <Image width={1} src={'images/redeem.png'} />
                        </Flex>
                      )
                    }
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>


        <Flex position={'relative'} justifyContent={'center'} alignItems={'center'} height={['auto','850px']} pt={0} pb={[4,6]}>
          <Flex width={1} flexDirection={'column'} maxWidth={['35em','70em']} px={[3,5]}>
            <Heading.h4 color={'dark-gray'} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]} textAlign={'center'} alignItems={'center'}>
              Maximize interest return
            </Heading.h4>
            <Flex height={['auto','500px']}>
              <EquityChart
                tokenConfig={availableTokens[1].SAI}
                selectedToken={'SAI'}
                isMobile={this.props.isMobile}
                account={this.props.account}
                web3={this.props.web3}
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex className={styles.gradientBackground} position={'relative'} justifyContent={'center'} alignItems={'center'} height={['auto','600px']} mt={[4,3]} p={[4,6]}>
          <Flex width={1} flexDirection={['column','row']} maxWidth={['35em','70em']}>
            <Flex width={[1,1/2]} justifyContent={'center'} flexDirection={'column'}>
              <Box>
                <Heading.h4 color={'dark-gray'} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]} textAlign={['center','left']}>
                  What makes us unique?
                </Heading.h4>
              </Box>
              <Box>
                <Heading.h4 color={'blue'} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]} textAlign={['center','left']}>
                  Our brand values
                </Heading.h4>
              </Box>
              <Box position={'relative'}>
                <Box className={[styles.carouselDesc,this.state.activeCarousel===1 || this.props.isMobile ? styles.selected : '']} py={[3,0]} my={[3,0]}>
                  {
                    this.props.isMobile && (
                      <Flex justifyContent={'center'}>
                        <Image src={'images/smart-contract.png'} pb={2} width={1/4} />
                      </Flex>
                    )
                  }
                  <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} my={[3,4]} color={'dark-gray'}>
                    100% non-custodial, and secured by audit.
                  </Heading.h3>
                  <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5} color={'dark-gray'}>
                    Idle smart contract passed a security audit control. We will never be able to touch your money while inside the smart contract. You are always in control of your money.
                  </Heading.h4>
                </Box>
                <Box className={[styles.carouselDesc,this.state.activeCarousel===2 || this.props.isMobile ? styles.selected : '']} py={[3,0]} my={[3,0]}>
                  {
                    this.props.isMobile && (
                      <Flex justifyContent={'center'}>
                        <Image src={'images/no-hidden-feeds.png'} pb={2} width={1/4} />
                      </Flex>
                    )
                  }
                  <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} my={[3,4]} color={'dark-gray'}>
                    Just relax and watch your interest grows up
                  </Heading.h3>
                  <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5} color={'dark-gray'}>
                    Don't loose your mind following interest rates on different lending protocols, let Idle do the dirty work and save time for yourself.
                  </Heading.h4>
                </Box>
                <Box className={[styles.carouselDesc,this.state.activeCarousel===3 || this.props.isMobile ? styles.selected : '']} py={[3,0]} my={[3,0]}>
                  {
                    this.props.isMobile && (
                      <Flex justifyContent={'center'}>
                        <Image src={'images/decentralized.png'} pb={2} width={1/4} />
                      </Flex>
                    )
                  }
                  <Heading.h3 textAlign={['center','left']} fontFamily={'sansSerif'} fontSize={[3,3]} my={[3,4]} color={'dark-gray'}>
                    Save money while optimizing your interest rate returns
                  </Heading.h3>
                  <Heading.h4 fontSize={[2,2]} px={[3,0]} textAlign={['center','left']} fontWeight={2} lineHeight={1.5} color={'dark-gray'}>
                    Our "one-for-all" rebalance mechanism allows you to save money in terms of transaction fees, giving you back the best available interest rate on the market.
                  </Heading.h4>
                </Box> 
              </Box>
            </Flex>
            {
              !this.props.isMobile && (
                <Flex flexDirection={'column'} width={[1,1/2]} justifyContent={'flex-end'} alignItems={'flex-end'}>
                  <Box width={'550px'} position={'relative'} minHeight={'500px'}>
                    <Flex flexDirection={'column'} textAlign={'center'} alignItems={'center'} justifyContent={'center'} className={[styles.carouselItem,this.state.activeCarousel===1?  styles.pos1 : (this.state.activeCarousel===2 ? styles.pos3 : styles.pos2) ]} boxShadow={ this.state.activeCarousel===1 ? 4 : 1} m={[2,3]} onClick={e => this.state.setActiveCarousel(1)}>
                      <Image src={'images/smart-contract.png'} pb={2} />
                      <Text fontSize={3} fontWeight={3} color={'dark-gray'}>Non Custodial</Text>
                    </Flex>
                    <Flex flexDirection={'column'} textAlign={'center'} alignItems={'center'} justifyContent={'center'} className={[styles.carouselItem,this.state.activeCarousel===2 ? styles.pos1 : (this.state.activeCarousel===1 ? styles.pos2 : styles.pos3)]} boxShadow={ this.state.activeCarousel===2 ? 4 : 1} m={[2,3]} onClick={e => this.state.setActiveCarousel(2)}>
                      <Image src={'images/no-hidden-feeds.png'} pb={2} />
                      <Text fontSize={3} fontWeight={3} color={'dark-gray'}>No Stress</Text>
                    </Flex>
                    <Flex flexDirection={'column'} textAlign={'center'} alignItems={'center'} justifyContent={'center'} className={[styles.carouselItem,this.state.activeCarousel===3 ? styles.pos1 : (this.state.activeCarousel===2 ? styles.pos2 : styles.pos3)]} boxShadow={ this.state.activeCarousel===3 ? 4 : 1} m={[2,3]} onClick={e => this.state.setActiveCarousel(3)}>
                      <Image src={'images/decentralized.png'} pb={2} />
                      <Text fontSize={3} fontWeight={3} color={'dark-gray'}>Cost Efficent</Text>
                    </Flex>
                  </Box>
                  <Flex width={1} alignItems={'center'} justifyContent={'center'} position={'relative'} zIndex={'10'}>
                    <Link className={[styles.carouselNav,this.state.activeCarousel===1 ? styles.selected : '']} onClick={e => this.state.setActiveCarousel(1)}></Link>
                    <Link className={[styles.carouselNav,this.state.activeCarousel===2 ? styles.selected : '']} onClick={e => this.state.setActiveCarousel(2)}></Link>
                    <Link className={[styles.carouselNav,this.state.activeCarousel===3 ? styles.selected : '']} onClick={e => this.state.setActiveCarousel(3)}></Link>
                  </Flex>
                </Flex>
              )
            }
          </Flex>
        </Flex>

        <Flex className={styles.gradientBackground} flexDirection={'column'} position={'relative'} justifyContent={'center'} alignItems={'center'} p={[3,6]} pb={[4,6]}>
          <Flex position={'relative'} zIndex={'10'} flexDirection={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} width={1} maxWidth={['35em','70em']}>
            <Flex width={1} flexDirection={['column','row']} alignItems={'center'}>
              {
                !this.props.isMobile && (
                <Box width={1/2}>
                    <Heading.h3 color={'dark-gray'} textAlign={'left'} fontWeight={4} lineHeight={'initial'} fontSize={[4,4]}>
                      Underlying protocol allocation
                    </Heading.h3>
                </Box>
                )
              }
              <Flex width={[1,1/2]} flexDirection={'column'}>
                <Heading.h3 color={'dark-gray'} textAlign={'center'} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]}>
                  Get the best APR, always.
                </Heading.h3>
              </Flex>
            </Flex>
            <Flex flexDirection={['column','row']} width={[1,7/8]} mt={4}>
              <Flex width={[1,1/2]} flexDirection={['row','column']}>

                {
                  this.props.tokenConfig.protocols.map((protocolInfo,i)=>{
                    const protocolAddr = protocolInfo.address;
                    const protocolName = protocolInfo.name;
                    const protocolToken = protocolInfo.token;
                    const protocolLoaded = this.state.protocolsAprs && this.state.protocolsAprs[protocolAddr] && this.state.protocolsAllocations && this.state.protocolsAllocations[protocolAddr];
                    const protocolAllocation = protocolLoaded ? parseFloat(this.state.protocolsAllocations[protocolAddr]) : null;
                    const protocolAllocationPerc = protocolAllocation ? parseFloat(protocolAllocation)/parseFloat(this.state.totalAllocation) : 0;
                    const protocolOpacity = protocolAllocationPerc>maxOpacity ? maxOpacity : (protocolAllocationPerc<minOpacity) ? minOpacity : protocolAllocationPerc;
                    // const protocolApr = protocolLoaded ? parseFloat(this.state.protocolsAprs[protocolAddr]) : 0;
                    // const protocolEarningPerYear = protocolAllocation ? parseFloat(this.functionsUtil.BNify(protocolAllocation).times(this.functionsUtil.BNify(protocolApr/100))) : 0;
                    // const protocolAllocationEndOfYear = protocolAllocation ? parseFloat(this.functionsUtil.BNify(protocolAllocation).plus(this.functionsUtil.BNify(protocolEarningPerYear))) : 0;
                    return (
                      <Flex key={`allocation_${protocolName}`} width={[1/2,1]} flexDirection={['column','row']} mr={ !i ? [1,0] : null} mt={ i ? [0,4] : null} ml={ i ? [1,0] : null}>
                        <Flex width={[1,1/2]} flexDirection={'column'}>
                          <Flex flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
                            <Image src={`images/tokens/${protocolToken}.svg`} height={['1.3em', '2em']} mr={[1,2]} my={[2,0]} verticalAlign={['middle','bottom']} />
                            <Text.span fontSize={[2,3]} textAlign={['center','left']} fontWeight={3} color={'dark-gray'}>
                              {protocolToken}
                            </Text.span>
                          </Flex>
                          <Box>
                            <Card my={[2,2]} p={3} borderRadius={'10px'} boxShadow={protocolAllocationPerc>0 ? 4 : 1}>
                              <Text fontSize={[4,5]} fontWeight={4} textAlign={'center'}>{(protocolAllocationPerc*100).toFixed(2)}<Text.span fontWeight={3} fontSize={['90%','70%']}>%</Text.span></Text>
                            </Card>
                          </Box>
                        </Flex>

                        {
                          !i ? (
                            <Box width={1/2} zIndex={'-1'} position={'relative'} height={'80px'} borderRadius={['0 0 0 30px','0 50px 0 0']} borderBottom={[`10px solid rgba(0,54,255,${protocolOpacity})`,0]} borderLeft={[`10px solid rgba(0,54,255,${protocolOpacity})`,0]}  borderTop={[0,`15px solid rgba(0,54,255,${protocolOpacity})`]} borderRight={[0,`15px solid rgba(0,54,255,${protocolOpacity})`]} top={['-10px','75px']} left={['48%',0]}>
                              <Box position={'absolute'} display={'block'} className={[styles.bulletPoint,styles.bulletLeft,this.props.isMobile ? styles.bulletMobile : '']}></Box>
                            </Box>
                          ) : (
                            <Box width={1/2} zIndex={'-1'} position={'relative'} height={['80px','72px']} borderRadius={['0 0 30px 0','0 0 50px 0']} borderBottom={[`10px solid rgba(0,54,255,${protocolOpacity})`,`15px solid rgba(0,54,255,${protocolOpacity})`]} borderRight={[`10px solid rgba(0,54,255,${protocolOpacity})`,`15px solid rgba(0,54,255,${protocolOpacity})`]} top={['-10px','18px']} left={['0%',0]}>
                              <Box position={'absolute'} display={'block'} className={[styles.bulletPoint,styles.bulletBottomBottom,this.props.isMobile ? styles.bulletMobile : '']}></Box>
                            </Box>
                          )
                        }
                      </Flex>
                    )
                  })
                }
              </Flex>

              <Flex width={[1,1/2]} flexDirection={['column','row']}>
                <Flex zIndex={'-1'} width={[1,2/5]} flexDirection={['column','row']} position={'relative'} height={['50px','100%']}>
                  <Box className={styles.rebalanceCircle} position={'absolute'} zIndex={'2'} width={['50px','72px']} height={['50px','72px']} backgroundColor={'white'} borderRadius={'50%'} boxShadow={2} left={['50%','-44px']} top={['0','50%']} mt={['-41px','-14px']} ml={['-25px',0]}></Box>
                  <Box position={'absolute'} zIndex={'1'} width={['20%','100%']} height={['100px','auto']} top={[0,'55%']} left={['50%',0]} ml={['-5px',0]} borderLeft={[`10px solid rgba(0,54,255,${idleOpacity})`,'0']} borderTop={[0,`15px solid rgba(0,54,255,${idleOpacity})`]}></Box>
                  <Box position={'absolute'} display={['none','block']} className={styles.bulletPoint} borderLeft={'15px solid #0036ff'} top={'52%'} right={'-15px'}></Box>
                </Flex>
                <Flex width={[1,3/5]} flexDirection={'column'} position={'relative'}>
                  <Flex width={1} flexDirection={'column'} height={'100%'} justifyContent={'center'}>
                    <Flex justifyContent={'center'} alignItems={'center'}>
                      <Image src={`images/tokens/${this.props.tokenConfig.idle.token}.png`} height={['1.3em', '2em']} mr={[1,2]} verticalAlign={'middle'} />
                      <Text.span fontSize={[4,5]} textAlign={'center'} fontWeight={3} color={'dark-gray'}>
                        {this.props.tokenConfig.idle.token}
                      </Text.span>
                    </Flex>
                    <Box>
                      <Card my={[2,2]} p={4} borderRadius={'10px'} boxShadow={this.state.currentRate ? 4 : 0}>
                        <Text fontSize={[5,7]} fontWeight={4} textAlign={'center'}>
                          {this.state.currentRate ? this.state.currentRate : '0.00' }<Text.span fontWeight={3} fontSize={['90%','70%']}>%</Text.span>
                        </Text>
                      </Card>
                    </Box>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex width={1} flexDirection={['column','row']} alignItems={'center'}>
              <Box width={[1,1/2]}></Box>
              <Flex width={[1,1/2]} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
                <Flex width={[1,4/7]}>
                  <Heading.h3 style={{width:'100%'}} color={'dark-gray'} textAlign={'center'} fontWeight={2} lineHeight={'initial'} fontSize={[2,2]} pt={[2,0]}>
                    The <strong>best available interest rate</strong>,<br />on auto-pilot.
                  </Heading.h3>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {
        /*
        <Flex flexDirection={'column'} position={'relative'} justifyContent={'center'} alignItems={'center'} p={[3,5]} pb={[4,5]}>
          <Flex position={'relative'} zIndex={'10'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} width={1} maxWidth={['35em','70em']}>
            <Heading.h4 color={'dark-gray'} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]} textAlign={'center'} alignItems={'center'}>
              We just rely on the Best
            </Heading.h4>
            <Box width={1} mt={[3,4]}>
              <DefiScoreTable tokenConfig={this.props.tokenConfig} />
            </Box>
          </Flex>
        </Flex>

        */
        }

        <Box id="faq" pt={[4,6]} pb={[4,6]}>
          <Box maxWidth={['50em','60em']} mx={'auto'} px={[3,5]}>
            <Faq selectedToken={this.props.selectedToken} tokenConfig={this.props.tokenConfig} />
          </Box>
        </Box>

        <Flex id="newsletter" flexDirection={'column'} position={'relative'} justifyContent={'center'} alignItems={'center'} pb={[3,6]} px={[3,6]}>
          <Flex flexDirection={'column'} justifyContent={['center','flex-start']} alignItems={['center','flex-start']} width={1} maxWidth={['35em','70em']}>
            <Heading.h3 color={'blue'} textAlign={['center','left']} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]}>
              Don't be shy, let's talk.
            </Heading.h3>
            <Heading.h3 color={'dark-gray'} textAlign={['center','left']} fontWeight={4} lineHeight={'initial'} fontSize={[4,5]}>
              Let's build something great together.
            </Heading.h3>
            <NewsletterForm />
          </Flex>
        </Flex>

        <Footer />
      </Box>
    );
  }
}

export default Landing;