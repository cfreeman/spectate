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

import { Map } from 'immutable';
import React from 'react';

var SaveButton = React.createClass({
	render: function() {
		const { store } = this.context;
		var state = store.getState();

		var blob = new Blob([JSON.stringify(state)],
							{type: "application/json"});
		var url = URL.createObjectURL(blob);

		return <a className="pure-button pure-button-primary" download="spectate.json" href={url}>Save Settings</a>
	}
})
SaveButton.contextTypes = {
  store: React.PropTypes.object
};

var LoadNumbers = React.createClass({
	handleLoad: function(event) {
		const { store } = this.context;
		var state = store.getState();

		var file = event.target.files[0];
		if (!file) {
			return;
		}

		var reader = new FileReader();

		reader.onload = function(e) {
			var column = 0;
			var newNums = Map({});

			this.result.split('\n').map(function(line, row) {
				line.split(',').map(function(number, col) {
					if ('+' + number == state.twilioNum) {
						column = col;
					} else if (column == col && row != 0) {
						newNums = newNums.set("+61" + number, 0);
						console.log("e: +61" + number);
					}
				});
			});

			console.log(newNums);
			store.dispatch({type:'LOAD_NUMBERS', numbers:newNums});
		};
		reader.readAsText(file);
	},

	render: function() {
		return (
			<div className="fileUpload pure-button pure-button-primary">
				<span>Load Contacts</span>
				<input id="numbers-file" className="upload disabled" type="file" onChange={this.handleLoad}/>
			</div>
		);
	}
})
LoadNumbers.contextTypes = {
  store: React.PropTypes.object
};

var LoadButton = React.createClass({
	handleLoad: function(event) {
		const { store } = this.context;

		var file = event.target.files[0];
		if (!file) {
			return;
		}

		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;
			store.dispatch({ type:'LOAD_SETTINGS', contents:contents});
		};
		reader.readAsText(file);
	},

	render: function() {
		return (
			<div className="fileUpload pure-button pure-button-primary">
				<span>Load Settings</span>
				<input id="settings-file" className="upload" type="file" onChange={this.handleLoad}/>
			</div>
		);
	}
})
LoadButton.contextTypes = {
  store: React.PropTypes.object
};

export { SaveButton, LoadButton, LoadNumbers };