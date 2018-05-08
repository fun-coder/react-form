import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import enzyme from 'enzyme';

enzyme.configure({ adapter: new Adapter() });

class InputField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>Hello world</div>;
  }
}

test("should set field in props", () => {
  const component = enzyme.shallow(<InputField />);
  expect(component.find('div').text()).toEqual('Hello world');
});