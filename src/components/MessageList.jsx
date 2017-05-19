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
import { SendSMS } from '../reducers/index.js';

var MessageButton = React.createClass({
  handleSendSMS: function() {
    const { store } = this.context;

    var state = store.getState();
    var msg = this.props.message;

    state.selectedNums.map(function(n) {
      SendSMS(state.twilioSID, state.twilioAut, n, state.twilioNum, msg);
      console.log('sending SMS to' + n);
    })
  },

  render: function() {
    const { store } = this.context;
    var state = store.getState();

    var buttonClass = "button-success pure-button pure-button-disabled"
    if (state.selectedNums.length > 0) {
      buttonClass = "button-success pure-button";
    }

    return <p><button className={buttonClass} onClick={this.handleSendSMS}>{this.props.message}</button></p>;
  }
})
MessageButton.contextTypes = {
  store: React.PropTypes.object
};

var MessageList = React.createClass({
  handleKeyPress: function(event) {
    if(event.key == 'Enter') {
      this.handleAddMessage();
    }
  },

  handleAddMessage: function() {
    const { store } = this.context;
    store.dispatch({ type:'ADD_MESSAGE',
                     message:document.getElementById('MessageField').value});
    document.getElementById('MessageField').value = "";
  },

	render: function() {
		const { store } = this.context;
    var state = store.getState();

    var m = <p>Use 'update messages' to create SMS templates that can be sent.</p>
    if (state.messages.length > 0) {
      m = state.messages.map(function(msg) {return <MessageButton key={msg} message={msg} />})
    }

		return (
		  <div className="pure-u-18-24">
        <fieldset className="pure-form">
        <legend><b>Update Messages:</b></legend>
        <input id="MessageField" type="text" placeholder="Message" onKeyPress={this.handleKeyPress}></input>
        <button className="pure-button pure-button-primary" onClick={this.handleAddMessage}>Add</button>
        </fieldset>

        <h2>3. Send message:</h2>
        { m }
      </div>
    )
	}
})
MessageList.contextTypes = {
	store: React.PropTypes.object
};

export default MessageList