import { createMuiTheme } from "@material-ui/core";
import { teal, red } from "@material-ui/core/colors";

export const appTheme = createMuiTheme({
    palette: {
      primary: teal,
      secondary: red,
    },
    typography: {
        useNextVariants: true
    }
});
