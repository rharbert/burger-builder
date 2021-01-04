import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import Errors from '../../hoc/Errors';
import axios from '../../axios-instance-orders';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4, 
    purchasable: false, 
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    axios.get('https://react-burger-builder-5d11f.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState( {ingredients: response.data} );
      })
      .catch (error => {
        this.setState( {error: true} )
      });
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(ingKey => {
        return ingredients[ingKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({purchasable: sum > 0}); 
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    this.setState( {totalPrice: newPrice, ingredients: updatedIngredients} );
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    //if Statement assures that nothing happens if we try to reduce (clicking the Less button) for an ingredient which we didn't add
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    this.setState( {totalPrice: newPrice, ingredients: updatedIngredients} );
    this.updatePurchaseState(updatedIngredients);
  }

  purchaseHandler = () => {
    this.setState( {purchasing: true} );
  }

  purchaseCancelHandler = () => {
    this.setState( {purchasing: false} );
  }

  purchaseContinueHandler = () => {
    this.setState( { loading: true } );
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Rachael H',
        address: {
          street: '123 Funny Bunny St',
          zipCode: '32205',
          country: 'USA'
        },
        email: 'test@bodigiti.com'
      },
      deliveryMethod: 'ASAP'
    }
    axios.post('/orders.json', order) //.json added to allow Firebase (our database) to function correctly
      .then(response => {
        this.setState( { loading: false, purchasing: false } );
      })
      .catch(error => {
        this.setState( { loading: false, purchasing: false } );
      }); 
  }
  
  render () {
    /* I feel that this disabledInfo code and the disabled property in the BuildControls is unnecessary */ 
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    } /* End unnecessary */

    let orderSummary = null;  
    let burger = this.state.error ? <p>Ingredients aren't loading!</p> : <Spinner />;
    
    if (this.state.ingredients)  {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabledInfo={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
            />
        </Aux>);

      orderSummary = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
     />;
    }

    if ( this.state.loading ) {
      orderSummary = <Spinner />
    }
    
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default Errors(BurgerBuilder, axios);