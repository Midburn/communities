import React from 'react';
import { mount } from 'enzyme';
import {DataHoverCard} from "./DataHoverCard";

describe('DataHoverCard should', () => {
    it('Render the title visible', () => {
        const TEST_TITLE = 'Test Title';
        const wrapper = mount(<DataHoverCard title={TEST_TITLE}/>);
        const DOM = wrapper.getDOMNode();
        expect(DOM.querySelector('[data-hook="card-title"]').text === TEST_TITLE);
    });
    it('Not render card data without hover', () => {
        const wrapper = mount(<DataHoverCard/>);
        const DOM = wrapper.getDOMNode();
        expect(DOM.querySelector('[data-hook="card-data"]')).toBeFalsy();
    });
    it('Render card data on title hover', () => {
        const SAMPLE_COMPONENT = <div data-hook="test-component">
            Some Rendered Data
        </div>;
        const wrapper = mount(<DataHoverCard panel={SAMPLE_COMPONENT}/>);
        const title = wrapper.find('[data-hook="card-title"]');
        title.simulate('mouseover');
        const DOM = wrapper.getDOMNode();
        expect(DOM.querySelector('[data-hook="card-data"]')).toBeTruthy();
    });
    it('Render card data inside card', () => {
        const SAMPLE_COMPONENT = <div data-hook="test-component">
            Some Rendered Data
        </div>;
        const wrapper = mount(<DataHoverCard panel={SAMPLE_COMPONENT}/>);
        const title = wrapper.find('[data-hook="card-title"]');
        title.simulate('mouseover');
        const DOM = wrapper.getDOMNode();
        expect(DOM.querySelector('[data-hook="test-component"]')).toBeTruthy();
    });
});