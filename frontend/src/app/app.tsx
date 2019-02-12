import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { appTheme } from "./app-theme";
import { TopBar } from "./shell/top-nax";
import { TicTacToeGame } from "./games/tic-tac-toe/tic-tac-toe-game";

const styles = (theme: Theme) => createStyles({
    gameContainer: {
        padding: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "column",
        flexGrow: 1
    }
})
const _App = ({ classes }: Props) => (
    <Router>
        <>
            <CssBaseline />
            <MuiThemeProvider theme={ appTheme }>
                <TopBar />
                <main className={ classes.gameContainer }>
                    <Switch>
                        <Route path="/tic-tac-toe" component={ TicTacToeGame } />
                        <Route path="/" exact render={() => <Redirect to="/tic-tac-toe" />} />
                    </Switch>
                </main>
            </MuiThemeProvider>
        </>
    </Router>
)

interface Props extends WithStyles<typeof styles> {

}

export const App = withStyles(styles)(_App)