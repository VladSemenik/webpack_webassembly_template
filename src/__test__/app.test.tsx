import React from 'react'
import { shallow } from 'enzyme'

import App from '../App'

test('app rendered right', () => {
  expect(shallow(<App />).text()).toBe('App')
})
