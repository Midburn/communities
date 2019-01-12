 import React from 'react';
import { Card, CardBody } from 'mdbreact';
import { Doughnut } from 'react-chartjs-2';
import colors from '../../styles/_colors.scss';
import './DoughnutCard.scss';

export const DoughnutCard = ({data, note, className}) => {
    if (!data || !Array.isArray(data)) {
        throw new Error('Must pass array type `data` prop to DoughnutCard!');
    }
    const [firstStat, secondStat] = data;
    if (firstStat.focus && secondStat.focus) {
        throw new Error('`focus` property should be specified to only one stat!');
    }
    const _data = {
        labels: [
            firstStat.label,
            secondStat.label
        ],
        datasets: [
            {
                data: [firstStat.value, secondStat.value],
                backgroundColor: [
                    colors.yellow,
                    colors['light-gray'],
                ],
                hoverBackgroundColor: [
                    colors.orange,
                    colors['light-gray'],
                ]
            }
        ],
    };
    const BASE_OPTIONS = {
        resposive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 200,
            easing: 'easeInCubic'
        },
        legend: {
            display: false
        }
    };
    return (
        <Card className={`DoughnutCard ${className}`}>
            <CardBody className="d-flex position-relative">
                <div className="DetailsArea w-50">
                    <div className="LegendArea">
                        <div className="d-flex align-items-center">
                            <div className="LegendColor yellow"></div>
                            {firstStat.label}
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="LegendColor light-gray"></div>
                            {secondStat.label}
                        </div>
                    </div>
                    <div className="FocusArea">
                        {data.map(stat => {
                            return (
                                stat.focus ? <div key={stat.label}>
                                        <h5>{stat.label}</h5>
                                        <div className="FocusLine"></div>
                                    </div>
                                    : null
                            )
                        })}
                    </div>
                    <div className="NoteArea">
                        {note || ''}
                    </div>
                </div>
                <div className="ChartArea  w-50">
                    <Doughnut data={_data} options={BASE_OPTIONS}/>
                    {data.map(stat => {
                        return (
                            stat.focus ? <div key={stat.label} className="FocusData">
                                    {stat.value || ' '}
                                </div>
                                : null
                        )
                    })}
                </div>
            </CardBody>
        </Card>
    )
};