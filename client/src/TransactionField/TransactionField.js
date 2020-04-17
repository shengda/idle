import theme from '../theme';
import React, { Component } from 'react';
import SmartNumber from '../SmartNumber/SmartNumber';
import { Flex, Text, Icon, Link, Image } from "rimble-ui";
import FunctionsUtil from '../utilities/FunctionsUtil';
import ShortHash from "../utilities/components/ShortHash";

class TransactionField extends Component {

  state = {};

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
    this.loadField();
  }

  async componentDidUpdate(prevProps, prevState) {
    this.loadUtils();

    const hashChanged = prevProps.hash !== this.props.hash;
    const accountChanged = prevProps.account !== this.props.account;
    const fieldChanged = prevProps.fieldInfo.name !== this.props.fieldInfo.name;
    if (fieldChanged || hashChanged || accountChanged){
      this.loadField();
    }
  }

  async loadField(){
    const fieldInfo = this.props.fieldInfo;
    if (this.props.hash && this.props.account){
      switch (fieldInfo.name){
        case 'icon':
        break;
        case 'hash':
          
        break;
        case 'action':
          
        break;
        case 'date':
        break;
        case 'status':
        break;
        case 'amount':
        break;
        case 'asset':
        break;
        default:
        break;
      }
    }
  }

  render(){
    let icon = null;
    let color = null;
    let output = theme.colors.transactions.action.default;
    let bgColor = theme.colors.transactions.actionBg.default;
    const fieldInfo = this.props.fieldInfo;
    const transaction = this.props.transaction;
    switch (fieldInfo.name){
      case 'icon':
        if (transaction.action){
          color = theme.colors.transactions.action[transaction.action.toLowerCase()] ? theme.colors.transactions.action[transaction.action.toLowerCase()] : color;
          bgColor = theme.colors.transactions.actionBg[transaction.action.toLowerCase()] ? theme.colors.transactions.actionBg[transaction.action.toLowerCase()] : bgColor;
        }
        switch (transaction.action) {
          case 'Deposit':
            icon = "ArrowForward";
          break;
          case 'Redeem':
            icon = "ArrowBack";
          break;
          case 'Send':
            icon = "Send";
          break;
          case 'Receive':
            icon = "Redo";
          break;
          case 'Migrate':
            // icon = "Sync";
            icon = "Repeat";
          break;
          case 'Swap':
            icon = "SwapHoriz";
          break;
          case 'Withdraw':
            icon = "ArrowUpward";
          break;
          default:
            icon = "Refresh";
          break;
        }
        output = (
          <Flex
            p={'5px'}
            borderRadius={'50%'}
            {...fieldInfo.props}
            alignItems={'center'}
            backgroundColor={bgColor}
            justifyContent={'center'}
          >
            <Icon
              align={'center'}
              name={ icon }
              color={ color }
              size={"1.4em"}
            />
          </Flex>
        );
      break;
      case 'hash':
        output = (
          <Link
            href={`https://etherscan.io/tx/${transaction.hash}`}
            target={'_blank'}
            rel="nofollow noopener noreferrer"
          >
            <ShortHash
              fontSize={1}
              color={'white'}
              {...fieldInfo.props}
              hash={transaction.hash}
            />
          </Link>
        );
      break;
      case 'action':
        output = (
          <Text {...fieldInfo.props}>{transaction.action.toUpperCase()}</Text>
        );
      break;
      case 'date':
        const formattedDate = transaction.momentDate.format('DD MMM, YYYY');
        output = (
          <Text {...fieldInfo.props}>{formattedDate}</Text>
        );
      break;
      case 'statusIcon':
        color = theme.colors.transactions.status[transaction.status.toLowerCase()];
        switch (transaction.status) {
          case 'Completed':
            icon = "Done";
          break;
          case 'Pending':
            icon = "Timelapse";
          break;
          case 'Failed':
            icon = "ErrorOutline";
          break;
          default:
          break;
        }
        output = (
          <Flex
            p={'1px'}
            width={'26px'}
            height={'26px'}
            borderRadius={'50%'}
            {...fieldInfo.props}
            alignItems={'center'}
            border={`2px solid ${color}`}
            justifyContent={'center'}
          >
            <Icon
              align={'center'}
              name={ icon }
              color={ color }
              size={"1.2em"}
            />
          </Flex>
        );
      break;
      case 'status':
        output = (
          <Text {...fieldInfo.props}>{transaction.status}</Text>
        );
      break;
      case 'amount':
        output = (
          <SmartNumber {...fieldInfo.props} number={transaction.amount} />
        );
      break;
      case 'tokenIcon':
        output = (
          <Image src={`images/tokens/${transaction.tokenSymbol}.svg`} {...fieldInfo.props} />
        );
      break;
      case 'tokenName':
        output = (
          <Text {...fieldInfo.props}>{transaction.tokenSymbol}</Text>
        );
      break;
      default:
      break;
    }
    return output;
  }
}

export default TransactionField;