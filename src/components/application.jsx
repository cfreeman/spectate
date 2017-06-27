/*
 * Copyright (c) Clinton Freeman 2017
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
"use strict";

import React from 'react';
import { GetSMS } from '../reducers/index.js';
import NumberList from './NumberList.jsx'
import MessageLog from './MessageLog.jsx'
import { SaveButton, LoadButton } from './SaveSettings.jsx'

var TwilioSID = React.createClass({
  getIntialState: function() {
    return {value: ''};
  },

  handleChange: function(event) {
    const { store } = this.context;

    this.setState({value: event.target.value});
    store.dispatch({type: 'SET_TWILIOSID', twilioSID:event.target.value});
  },

  render: function() {
    const { store } = this.context;
    var state = store.getState();

    return (
      <input id="twilioSID" type="text" placeholder="Account SID" value={state.twilioSID} onChange={this.handleChange}></input>
    );
  }
});
TwilioSID.contextTypes = {
  store: React.PropTypes.object
};

var TwilioAut = React.createClass({
  getIntialState: function() {
    const { store } = this.context;
    var state = store.getState();
    return {value: state.twilioAut};
  },

  handleChange: function(event) {
    const { store } = this.context;

    this.setState({value: event.target.value});
    store.dispatch({type: 'SET_TWILIOAUT', twilioAut:event.target.value});
  },

  render: function() {
    const { store } = this.context;
    var state = store.getState();

    return (
      <input id="twilioAut" type="password" placeholder="Auth Token" value={state.twilioAut} onChange={this.handleChange}></input>
    );
  }
});
TwilioAut.contextTypes = {
  store: React.PropTypes.object
};

var TwilioNum = React.createClass({
  getIntialState: function() {
    const { store } = this.context;
    var state = store.getState();
    return {value: state.twilioNum};
  },

  handleChange: function(event) {
    const { store } = this.context;

    this.setState({value: event.target.value});
    store.dispatch({type: 'SET_TWILIONUM', twilioNum:event.target.value});
  },

  render: function() {
    const { store } = this.context;
    var state = store.getState();

    return (
      <input id="twilioNum" type="text" placeholder="Return Number" value={state.twilioNum} onChange={this.handleChange}></input>
    );
  }
});
TwilioNum.contextTypes = {
  store: React.PropTypes.object
};


var Application = React.createClass({
	loadFromServer: function() {
    const { store } = this.context;
    var state = store.getState();

    if (state.twilioSID != '' && state.twilioAut != '' && state.twilioNum) {
      var smsP = GetSMS(state.twilioSID, state.twilioAut, twilioNum);
      smsP.then(function(value) {
        store.dispatch({type: 'SET_REPLIES', replies:value});
      });
    }
  },

  componentDidMount: function() {
    this.loadFromServer();
    setInterval(this.loadFromServer, 2000);
  },

  render: function() {
		const { store } = this.context;
    var state = store.getState();

		return (
			<div>
		  <div className="pure-g">
    		<div className="pure-u-1-1">
    			<h1>SPECTATE Switchboard</h1>
      		<fieldset className="pure-form">
      		<TwilioSID /><TwilioAut /><TwilioNum />
          <SaveButton /><LoadButton />
      		</fieldset>

    		</div>
    	</div>
    	<div className="pure-g">
      	<NumberList />
    	</div>
      <div className="pure-g">
        <MessageLog />
      </div>
    	</div>
    )
	}
})
Application.contextTypes = {
	store: React.PropTypes.object
};

export default Application