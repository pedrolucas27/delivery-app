import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

//import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Menu from './pages/Menu';
import ShoppingCart from './pages/ShoppingCart';
import ListFlavors from './pages/ListFlavors';
import ListProducts from './pages/ListProducts';
import ListCompany from './pages/ListCompany';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Menu} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/menu" component={Menu} />
                <Route path="/shopping-cart" component={ShoppingCart} />
                <Route path="/flavors-by-category/:idCategory" component={ListFlavors} />
                <Route path="/products-by-filter" component={ListProducts} />
                <Route path="/company" component={ListCompany} />
                <Route path="/profile" component={Profile} />
                <Route path="*" component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
};
export default Routes;