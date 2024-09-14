import React from 'react';
import Form from './form';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Form />
    </ThemeProvider>
  );
}
export default App;