import React from 'react';
import { SearchInput } from './SearchInput';
import { shallow } from 'enzyme';

describe('SearchInput component', () => {
    it('should render input element', () => {
        const wrapper = shallow(<SearchInput />);
        const input = wrapper.find('input');
        expect(input).toBeTruthy();
    })
    it('should pass placeholder to input', () => {
        const PLACE_HOLDER = 'TEST';
        const wrapper = shallow(<SearchInput placeholder={PLACE_HOLDER} />);
        const placeholder = wrapper.find('input').props().placeholder;
        expect(placeholder).toEqual(PLACE_HOLDER);
    })
});