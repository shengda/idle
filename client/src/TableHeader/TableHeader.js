import { Flex } from "rimble-ui";
import React, { Component } from 'react';
import TableCellHeader from '../TableCellHeader/TableCellHeader';

class TableHeader extends Component {
  render() {
    return (
      <Flex
        width={1}
        px={[2,4]}
        flexDirection={'row'}
      >
        {
          this.props.cols.map((colInfo,colIndex) => {
            // Skip non-mobile columns
            if (colInfo.visible === false || (colInfo.mobile === false && this.props.isMobile)){
              return null;
            }

            return (colInfo.title && colInfo.title.length) ? (
              <TableCellHeader
                {...colInfo.props}
                desc={colInfo.desc}
                key={`col-header-${colIndex}`}
              >
                {colInfo.title}
              </TableCellHeader>
            ) : (
              <Flex key={`col-header-${colIndex}`} {...colInfo.props}></Flex>
            )
          })
        }
      </Flex>
    );
  }
}

export default TableHeader;
