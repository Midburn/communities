import React from 'react';
import { mount} from 'enzyme';
import {NumberEditor} from "./NumberEditor";

describe('NumberCounter component', () => {
    it('should set value received to input', () => {
        const testValue = 56;
        const wrapper = mount(<NumberEditor value={testValue}/>);
        const node = wrapper.getDOMNode();
        expect(node.querySelector('[data-hook="number-input"]').value).toEqual('' + testValue);
    });
    it('should output correct change on incrementing', () => {
        const testValue = 45;
        const onChange = jest.fn()
        const wrapper = mount(<NumberEditor value={testValue} onChange={onChange}/>);
        wrapper.find('#increment').simulate('click');
        expect(onChange).toHaveBeenCalledWith(testValue + 1);
    });
    it('should output correct change on decrementing', () => {
        const testValue = 45;
        const onChange = jest.fn()
        const wrapper = mount(<NumberEditor value={testValue} onChange={onChange}/>);
        wrapper.find('#decrement').simulate('click');
        expect(onChange).toHaveBeenCalledWith(testValue - 1);
    });
    it('should disable increment if max property is equal or larger then value', () => {
        const testValue = 45;
        const max = 45;
        const onChange = jest.fn()
        const wrapper = mount(<NumberEditor value={testValue} onChange={onChange} max={max}/>);
        const isIncBtnDisable = wrapper.find('#increment').props().disabled;
        expect(isIncBtnDisable).toBeTruthy();
    });
    it('should disable decrement if min property is equal or smaller then value', () => {
        const testValue = 0;
        const min = 0;
        const onChange = jest.fn()
        const wrapper = mount(<NumberEditor value={testValue} onChange={onChange} min={min}/>);
        const isDecBtnDisable = wrapper.find('#decrement').props().disabled;
        expect(isDecBtnDisable).toBeTruthy();
    });
});