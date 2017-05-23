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

var NumberList = React.createClass({
  handleKeyPress: function(event) {
    if(event.key == 'Enter') {
      this.handleAddNumber();
    }
  },

  handleAddNumber: function() {
    const { store } = this.context;
    store.dispatch({ type:'ADD_NUMBER',
                     number:document.getElementById('PhoneNumber').value});
    document.getElementById('PhoneNumber').value = "";
  },

  handleSelect: function(event) {
    const { store } = this.context;

    var children = Array.from(event.target.childNodes);
    var selected = children.filter(function(e) { return e.selected; })
                           .map(function(e) { return e.value; });

    store.dispatch({ type:'SELECT_NUMBERS',
                     numbers: selected});
  },

	render: function() {
		const { store } = this.context;
    var state = store.getState();

    var n = state.numbers.map(function(nu) {
       return <option key={nu} value={nu}>{nu}</option>;
    })

		return (
		  <div className="pure-u-5-24">
        <fieldset className="pure-form">
        <legend><b>Update contacts:</b></legend>
        <input id="PhoneNumber" type="text" placeholder="Phone number" onKeyPress={this.handleKeyPress}></input>
        <button className="pure-button pure-button-primary" onClick={this.handleAddNumber}>Add</button>
        </fieldset>

        <h2>2. Select contacts:</h2>
        <select multiple className="numbers" style={{minWidth:"100%"},{height:"90%"}} onChange={this.handleSelect}>
        { n }
        </select>
      </div>
    )
	}
})
NumberList.contextTypes = {
	store: React.PropTypes.object
};

export default NumberList