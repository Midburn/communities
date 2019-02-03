import React from 'react';
import { Card, CardBody } from 'mdbreact';
import { BarChart } from 'react-chartjs-2';
import './BarChartCard.scss';

export const BarChartCard = ({data, className}) => {
    data = [
        {
            title: 'test',
            value: 0.3
        },
        {
            title: 'test2',
            value: 0.7
        },
        {
            title: 'test3',
            value: 0.1
        },
        {
            title: 'test4',
            value: 0.9
        },

    ];
    return (
        <Card className={`BarChartCard ${className}`}>
            <CardBody className="d-flex justify-content-between chart-container">
                {data.map(dataItem => {
                    const percent = dataItem.value * 100;
                    return (
                        <div className="bar-container position-relative" key={dataItem.title}>
                            <div className="data-area">
                                <div className="data-container">
                                    <div className="data-value" style={{ height: `${percent}%`, opacity: dataItem.value}}></div>
                                </div>
                            </div>
                            <div className="data-number">{`${percent}%`}</div>
                            <div className="title-area">{dataItem.title}</div>
                        </div>
                    )
                })}
            </CardBody>
        </Card>
    )
};