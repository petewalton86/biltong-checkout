 import React, { Component } from "react";
 import "./PaymentDetails.css";
 import {
    Button,
    Fieldset,
    Form,
    TextBox,
  } from 'react-form-elements';
  import axios from "axios";
import AdyenDropin from "../AdyenCheckout";


 class PaymentDetails extends Component {
    constructor(props){
        super(props);
        this.state = {paymentState: 'getPaymentDetails', paymentMethods:{}, paymentDetails:{}}
    }
   render() {
     //setup render based on the progression of the transaction
    switch (this.state.paymentState){
      //allow user to input initial transaction details
        case 'getPaymentDetails':
            return ( 
                <Form
                  name="Payment Details" id="paymentDetailsForm"
                  onSubmit={data => {
                                      
                  }}
                >
                  <Fieldset legend="Payment Details " >
                      <br></br>
                    <TextBox
                      label="Amount "
                      name="inputWithNativeAttributes"
                      required
                      placeholder="Enter transaction amount"
                      id="amount"
                    />
                    <br></br>
                    <TextBox
                      label="Currency Code "
                      name="inputWithNativeAttributes"
                      required
                      placeholder="3 letter currency code"
                      id="currencyCode"
                    />
                    <br></br>
                    <TextBox
                      label="Country Code "
                      name="inputWithNativeAttributes"
                      required
                      placeholder="2 letter country code"
                      id="countryCode"
                    />
                    <br></br>
                    <TextBox
                      label="Sales Channel "
                      name="inputWithNativeAttributes"
                      required
                      placeholder="Web"
                      id="salesChannel"
                    />
                    <br></br>
                    <Button
                      onClick={e => {
                          var paymentDetailsObj = { amount: document.getElementById("amount").value*100,
                          currencyCode: document.getElementById("currencyCode").value,
                          countryCode: document.getElementById("countryCode").value,
                          salesChannel: document.getElementById("salesChannel").value};
                          console.info('Payment Submitted' + '\n' +
                          'Amount: ' + paymentDetailsObj.currencyCode + paymentDetailsObj.amount + '\n' + 
                          'Country Code: ' + paymentDetailsObj.countryCode + '\n' + 
                          'Sales Channel: ' + paymentDetailsObj.salesChannel );
                          
                          //get paymentMethods from the server
                          axios.post('https://mypaymentsserver.firebaseapp.com/getPaymentMethods', {
                value: paymentDetailsObj.amount,
                countryCode: paymentDetailsObj.countryCode,
                currencyCode: paymentDetailsObj.currencyCode,
                salesChannel: paymentDetailsObj.salesChannel
            })
              .then((response) => {
                 //load payment details request and payment method response to state & update the state
                 console.log(this.state.paymentState);
                this.setState({paymentMethods: response.data, paymentState:'selectMethod', paymentDetails: paymentDetailsObj});
              }, (error) => {
                console.log(error);
              });
                      }}
                    >
                      Submit Payment Details
                    </Button>
                  </Fieldset>
                </Form>
              );
              //update view to show user Adyen Dropin component and payment methods
              case 'selectMethod':
                  return (
                   <AdyenDropin paymentMethods={this.state.paymentMethods} paymentDetails={this.state.paymentDetails} />
                  );
              
                }
                }
    }

    
    
 export default PaymentDetails;

 