import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.blueGrey[900],
    },
    secondary: {
      main: colors.blueGrey[500],
    },
  },
});
export default theme;
