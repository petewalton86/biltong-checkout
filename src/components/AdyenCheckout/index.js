import React, { Component } from "react";
import axios from "axios";
import './AdyenCheckout.css'

let referenceReq = 'Pete Walton Test Payment';
let returnURLReq = 'https://adyencheckoutdemo-1a4b2.firebaseapp.com/';

class AdyenDropin extends Component {
    constructor(props) {
        super(props);
       this.state = {paymentState: 'pendingAuthorisation', pspReference: '', resultCode: ''};
        this.initAdyenCheckout = this.initAdyenCheckout.bind(this);
        }
  
  //load Adyen js and css files      
  componentDidMount() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.0.0/adyen.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.0.0/adyen.js";
    script.async = true;
    script.onload = this.initAdyenCheckout;
    document.body.appendChild(script);
    console.log(this.props)
    
  }

  initAdyenCheckout() {
      const configuration = {
      locale: "en_US",
      environment: "test",
      originKey: "pub.v2.8115650120946270.aHR0cHM6Ly9teWFkeWVuY2hlY2tvdXQuZmlyZWJhc2VhcHAuY29t.HuSyWx_EnZXt2r0aaJKPWDyKvPq3YcnCemdDpNeC8YI",
      paymentMethodsResponse: this.props.paymentMethods, 
      amount: {
        value: this.props.paymentDetails.amount,
        currency: this.props.paymentDetails.currencyCode
        }
    };
    const checkout = new window.AdyenCheckout(configuration);
    checkout
      .create("dropin", {
        paymentMethodsConfiguration: {
              card: { // Example optional configuration for Cards
              hasHolderName: true,
              onFocus: true,
              holderNameRequired: true,
              hideCVC: false, // Change this to true to hide the CVC field for stored cards
              showBrandIcon: true,
              name: 'Credit or debit card',
            }
          },
          
        onSubmit: (state, dropin) => {
            //make a payment using the state data and payment request data
            axios.post('https://mypaymentsserver.firebaseapp.com/makePayment', 
                 {
                    value: this.props.paymentDetails.amount,
                    countryCode: this.props.paymentDetails.countryCode,
                    currencyCode: this.props.paymentDetails.currencyCode,
                    salesChannel: this.props.paymentDetails.salesChannel,
                    merchantReference: referenceReq,
                    returnURL: returnURLReq,
                    dropinData:state.data
                  })
    .then(action => {console.log(action);
            
            
switch (action.data.resultCode){
    
    case 'RedirectShopper':
        dropin.handleAction(action.data.action);
        break;
        //update state with paymentState, pspReference and resultCode to be used in render switch
    case 'Authorised':
        this.setState({paymentState: 'paymentAuthorised', pspReference: action.data.pspReference, resultCode: action.data.resultCode})
         break;
}
     
      });
        },
        onAdditionalDetails: (state, dropin) => {
          // makeDetailsCall(state.data).then...
        }
      })
      .mount(this.ref);
  }

  render() {
     //update view depending on payment state
    switch (this.state.paymentState) {
        //if paymentState is not yet authorised, return the Adyen Checkout form
        case 'pendingAuthorisation':
            return (
                <div
                  ref={ref => {
                    this.ref = ref;
                  }}
                />
              );
        //when the payment is authorised, display success message with result and PSP reference
        case 'paymentAuthorised':
            return(
                <form className='trapezoid'>
                <h2>Thanks for your payment!</h2>
                <h3>Payment Details:</h3>
                <br></br>
                <label>Result: </label>
                <label>{this.state.resultCode}</label>
                <br></br>
                <label>PSP Reference: </label>
                <label>{this.state.pspReference}</label>
                </form>

                );
  }
}
}

export default AdyenDropin;
