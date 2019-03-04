import React from 'react';
import {Card, CardBody, MDBPopover, MDBPopoverBody} from 'mdbreact';
import './BarChartCard.scss';

export const BarChartCard = ({className, t, translatePrefix, data}) => {
  return (
    <Card className={`BarChartCard ${className}`}>
      <CardBody className="d-flex justify-content-between chart-container">
        {data.map (dataItem => {
          const percent = dataItem.value * 100;
          return (
            <div
              className={`bar-container bar-container-${translatePrefix}  position-relative`}
              key={dataItem.title}
            >
              <div className="data-area">
                <div className="data-container">
                  <div
                    className="data-value"
                    style={{
                      height: `${percent}%`,
                      minHeight: 1,
                      background: dataItem.value !== 0
                        ? `rgba(105, 121, 248, ${percent / 100})`
                        : 'rgba(105, 121, 248, 1)',
                    }}
                  >
                    <MDBPopover
                      className="btn btn-default data-popover"
                      tag="div"
                      placement="top"
                    >
                      <MDBPopoverBody>
                        <div>
                          <div>254 שויכו</div>
                          <div>46 טרם שויכו</div>
                        </div>
                      </MDBPopoverBody>
                    </MDBPopover>
                  </div>
                </div>
              </div>
              <div className="title-area">{dataItem.title}</div>
              <div className="data-number">{`${percent}%`}</div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
