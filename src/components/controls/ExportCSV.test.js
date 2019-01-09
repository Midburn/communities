import React from 'react';
import ReactDOM from 'react-dom';
import {ExportCSV} from './ExportCSV'
import { shallow } from 'enzyme';

describe('ExportCSV Component', () => {
    const TEST_TITLE = 'Test Title';
    const translateFunction = (term) => TEST_TITLE;
    it('should render correctly with sample properties', () => {
        const component = shallow(<ExportCSV t={translateFunction} data={{}} filename="Test"/>);
        expect(component).toMatchSnapshot();
    });
});