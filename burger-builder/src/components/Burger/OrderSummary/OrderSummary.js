import React from 'react';

import Aux from '../../../hoc/Auxiliary';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredients)
    .map(ingKey => {
      return (
        <li key={ingKey}>
          <span style={{textTransform: 'capitalize'}}>{ingKey}</span>: {props.ingredients[ingKey]}
        </li>);
    } );
  return (
    <Aux>
      <h3>Your Order</h3>
      <p>Your delicious burger is topped with the following...</p>
      <ul>
        {ingredientSummary}
      </ul>
      <p>Continue to Checkout?</p>
      <Button
        btnType="Danger"
        clicked={props.purchaseCanceled}
      >CANCEL</Button>
      <Button
        btnType="Success"
        clicked={props.purchaseContinue}
      >CONTINUE</Button>
    </Aux>
  );
};

export default orderSummary;