import React, { Component } from 'react';

import Modal from '../components/UI/Modal/Modal';
import Aux from '../hoc/Auxiliary';

const errors = (WrappedComponent, axios ) => {
  return class extends Component {
    state = {
      error: null
    }
    componentWillMount () { //WillMount will soon be unsupported; the Work Around = use constructor
      this.requestInterceptor = axios.interceptors.request.use(req => {
        this.setState( {error: null} );
        return req;
      });
      this.responseInterceptor = axios.interceptors.response.use(res => res, error => {
        this.setState( {error: error} );
      });
    }

    // Cleanup work: stop calling the interceptors when Error Handler is used on other pages other than Burger Builder
    componentWillUnmount() {
      axios.interceptors.request.eject(this.requestInterceptor);
      axios.interceptors.response.eject(this.responseInterceptor);
    } // End Cleanup work

    errorConfirmedHandler = () => {
      this.setState( {error:null} )
    }
    
    render () {
      return (
        <Aux>
          <Modal 
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  } 
}

export default errors;