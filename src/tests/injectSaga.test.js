/**
 * Test injectors
 */

import { put } from 'redux-saga/effects';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import injectSaga, { useInjectSaga } from '../injectSaga';
import * as sagaInjectors from '../sagaInjectors';

function configureStore() {
  const store = createStore(s => s);
  return store;
}

// Fixtures
const Component = () => null;

function* testSaga() {
  yield put({ type: 'TEST', payload: 'yup' });
}

describe('injectSaga decorator', () => {
  let store;
  let injectors;
  let ComponentWithSaga;

  beforeAll(() => {
    sagaInjectors.default = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    store = configureStore({});
    injectors = {
      injectSaga: jest.fn(),
      ejectSaga: jest.fn(),
    };
    ComponentWithSaga = injectSaga({
      key: 'test',
      saga: testSaga,
      mode: 'testMode',
    })(Component);
    sagaInjectors.default.mockClear();
  });

  it('should inject given saga and mode', () => {
    const props = { test: 'test' };
    renderer.create(
      <Provider store={store}>
        <ComponentWithSaga {...props} />
      </Provider>,
    );

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.injectSaga).toHaveBeenCalledWith('test', {
      saga: testSaga,
      mode: 'testMode',
    });
  });

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' };
    const renderedComponent = renderer.create(
      <Provider store={store}>
        <ComponentWithSaga {...props} />
      </Provider>,
    );
    renderedComponent.unmount();

    expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
  });

  it('should set a correct display name', () => {
    expect(ComponentWithSaga.displayName).toBe('withSaga(Component)');
    expect(
      injectSaga({ key: 'test', saga: testSaga })(() => null).displayName,
    ).toBe('withSaga(Component)');
  });

  it('should propagate props', () => {
    const props = { testProp: 'test' };
    const renderedComponent = renderer.create(
      <Provider store={store}>
        <ComponentWithSaga {...props} />
      </Provider>,
    );
    const {
      props: { children },
    } = renderedComponent.root;
    expect(children.props).toEqual(props);
  });
});

describe('useInjectSaga hook', () => {
  let store;
  let injectors;
  let ComponentWithSaga;

  beforeAll(() => {
    sagaInjectors.default = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    store = configureStore({});
    injectors = {
      injectSaga: jest.fn(),
      ejectSaga: jest.fn(),
    };
    ComponentWithSaga = () => {
      useInjectSaga({
        key: 'test',
        saga: testSaga,
      });
      return null;
    };
    sagaInjectors.default.mockClear();
  });

  it('should inject given saga and mode', () => {
    const props = { test: 'test' };
    render(
      <Provider store={store}>
        <ComponentWithSaga {...props} />
      </Provider>,
    );

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.injectSaga).toHaveBeenCalledWith('test', {
      saga: testSaga,
      mode: '@@saga-injector/counter',
    });
  });

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' };
    const { unmount } = render(
      <Provider store={store}>
        <ComponentWithSaga {...props} />
      </Provider>,
    );
    unmount();

    expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
  });
});
