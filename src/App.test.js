import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

describe('App Component', () => {
  it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
    it('should render correctly in "debug" mode', () => {
        const component = shallow(<App debug />);
        expect(component).toMatchSnapshot();
    });
});