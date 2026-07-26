/* eslint-env jest */
import {
    act,
} from 'react';
import {
    createRoot,
} from 'react-dom/client';
import {
    BrowserRouter,
} from 'react-router-dom';

jest.mock('@ericblade/quagga2', () => {
    return {};
});

import App from './App';

it('renders the V2 design system without crashing', () => {
    window.history.pushState({}, '', '/v2/design-system');
    const container = document.createElement('div');
    const root = createRoot(container);

    act(() => {
        root.render((
            <BrowserRouter>
                <App />
            </BrowserRouter>
        ));
    });
    expect(container.textContent).toContain('Designsystem');
    act(() => {
        root.unmount();
    });
});
