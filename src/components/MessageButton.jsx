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
import { Map } from 'immutable';
import { SendSMS } from '../reducers/index.js';

var MessageButton = React.createClass({
  handleSendSMS: function() {
    const { store } = this.context;

    var state = store.getState();
    var msg = this.props.message;

    if (typeof this.props.broadcast != 'undefined' && this.props.broadcast) {
      store.dispatch({ type:'BROADCAST'});
    }

    // If number supplied via props - just send to that.
    if (typeof this.props.number != 'undefined') {
      SendSMS(state.twilioSID, state.twilioAut, this.props.number, state.twilioNum, msg);

      store.dispatch({type:'SET_DEPTH', sid: this.props.sid, number: this.props.number, depth: this.props.depth})


    // No number supplied via props - send to everyone.
    } else {
      state.numbers.map(function(v, n) {
        SendSMS(state.twilioSID, state.twilioAut, n, state.twilioNum, msg);
      })
    }
  },

  render: function() {
    const { store } = this.context;
    var state = store.getState();

    var buttonClass = "button-success pure-button"
    if (typeof this.props.first != 'undefined' && this.props.first) {
      return null;
    }

    return <p><button className={buttonClass} onClick={this.handleSendSMS}>{this.props.message}</button></p>;
  }
})
MessageButton.contextTypes = {
  store: React.PropTypes.object
};

export default MessageButton