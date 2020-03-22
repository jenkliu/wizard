import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import HostApp from '../../ui/host/App';
import PlayerApp from '../../ui/player/App';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
	<Router history={browserHistory}>
		<Switch>
			<Route exact path="/" component={PlayerApp} />
			<Route exact path="/host" component={HostApp} />
		</Switch>
	</Router>
);
