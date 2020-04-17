import React, { Component } from 'react';
import { Heading, Card } from "rimble-ui";
import styles from './DashboardCard.module.scss';


class DashboardCard extends Component {
  render() {
    return (
      <Card
        p={0}
        boxShadow={1}
        borderRadius={2}
        minHeight={'initial'}
        background={'cardBg'}
        {...this.props.cardProps}
        className={this.props.isInteractive ? styles.interactive : null}
      >
        {
          this.props.title && this.props.title.length>0 &&
            <Heading.h4 mt={[3,4]} ml={[3,4]} color={'dark-gray'} fontWeight={4} lineHeight={'initial'} fontSize={[2,3]} textAlign={'left'}>
              {this.props.title}
            </Heading.h4>
        }
        {this.props.children}
      </Card>
    );
  }
}

export default DashboardCard;