import React, { Component } from 'react';

import Aux from '../../../hoc/Auxiliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  componentDidUpdate () {
    console.log('[OrderSummary] DidUpdate');
  }

  render () {
    const ingredientSummary = Object.keys(this.props.ingredients)
    .map(ingKey => {
      return (
        <li key={ingKey}>
          <span style={{textTransform: 'capitalize'}}>{ingKey}</span>: {this.props.ingredients[ingKey]}
        </li>);
    } );

    return (
      <Aux>
        <h3>Your Order</h3>
        <p>Your delicious burger is topped with the following...</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
        <p>Continue to Checkout?</p>
        <Button
          btnType="Danger"
          clicked={this.props.purchaseCanceled}
        >CANCEL</Button>
        <Button
          btnType="Success"
          clicked={this.props.purchaseContinue}
        >CONTINUE</Button>
      </Aux>
    );
  }
}

export default OrderSummary;