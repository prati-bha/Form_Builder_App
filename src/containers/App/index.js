/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ROUTES } from '../constants';
import List from '../List/index';
import Form from '../ManageForm/index';



export default function App() {
  return (
    <Switch>
      <Route exact path={ROUTES.HOME} component={List} />
      <Route path={`${ROUTES.MANAGE_FORM}/:id`} component={Form} />
      <Route path={`${ROUTES.NEW_FORM}`} component={Form} />
    </Switch>

  );
}
