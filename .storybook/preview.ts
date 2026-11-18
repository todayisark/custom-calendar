import type { Preview } from '@storybook/react-vite';

import '../stories/storybook.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default preview;
