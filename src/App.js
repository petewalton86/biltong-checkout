import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import PaymentDetails from './components/PaymentDetails'


    class App extends Component {

      displayQuestion = () => {
        this.setState({
            displayQuestions: !this.state.displayQuestions
        })
    }
      
      render() {
        return <div className="App">
            <Header />
            <section className="App-main">

              <PaymentDetails />
              {/* more posts */}
            </section>
          </div>;
      }
    }

    export default App;