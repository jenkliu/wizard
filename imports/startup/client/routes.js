import React from 'react';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// route components
import HostApp from '../../ui/host/HostApp';
import PlayerApp from '../../ui/player/PlayerApp';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
	<Router history={browserHistory}>
		<Switch>
			<Route exact path="/" component={PlayerApp} />
			<Route exact path="/host" component={HostApp} />
		</Switch>
	</Router>
);
