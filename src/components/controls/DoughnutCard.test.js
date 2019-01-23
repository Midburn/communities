import React from 'react';
import { mount } from 'enzyme';
import { DoughnutCard } from './DoughnutCard';

describe('DoughnutCard should', () => {
    it('Should render chartjs', () => {
        const wrapper = mount(<DoughnutCard />);
        const DOM = wrapper.getDOMNode();
        const chartJs = DOM.getElementsByClassName('chartjs-size-monitor');
        expect(chartJs).toBeTruthy()
    });
});