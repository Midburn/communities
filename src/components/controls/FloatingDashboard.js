import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import './FloatingDashboard.scss';

/**
 * @param sums { [title]: sum }
 * @param dataForExport - table data to be exported to CSV
 * @constructor
 */
export const FloatingDashboard = ({charts, title}) => {
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
        <div className="FloatingDashboard">
            <h3>{title}</h3>
            <div className="FloatingDashboardBody d-flex justify-content-center  align-items-center">
                {(charts || []).map((chart, index) => {
                    return (
                        <div key={index} className="d-flex align-items-center flex-column">
                            <label>{chart.title}</label>
                            <div>
                                <Doughnut data={chart.data} options={{...BASE_OPTIONS, ...chart.options}} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
