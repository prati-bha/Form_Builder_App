import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from '../../../utils/history';
import configureStore from '../../../app/store';
import List from '../index';
const store = configureStore();
const componentWrapper = () =>
    render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <List />
            </ConnectedRouter>
        </Provider>,
    );
describe('Check component:<Users /> is rendering properly', () => {
    it('Should render and match the snapshot', () => {
        const {
            container: { firstChild },
        } = componentWrapper();
        expect(firstChild).toMatchSnapshot();
    });
});
describe('Add New Form', () => {
    it('Click Add New Form should open modal', async () => {
        const { getByTestId, getByText, queryByText } = componentWrapper();
        // Fire Event
        fireEvent.click(getByTestId("Add_Form"));
        await waitFor(() => expect(queryByText('Add New Form')).toBeTruthy());
        // Check Elements are showing
        expect(getByText('Add New Form')).toBeTruthy();
    });
});