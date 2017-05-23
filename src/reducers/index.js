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

const initialState = {
  numbers:[],
  messages:[],
  selectedNums:[],
  twilioSID:'',
  twilioAut:'',
  twilioNum:'',
  replies:[]
}

// GetSMS gets all the SMS messages that have been sent to dstNum in the twilio account identified by
// twilioSID and twilioAut. Returns a promise that resolves to parsed JSON.
function GetSMS(twilioSID, twilioAut, dstNum) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.open("GET",
             'https://api.twilio.com/2010-04-01/Accounts/' + twilioSID + '/Messages.json?PageSize=1000',
             true);
    xhr.setRequestHeader("Authorization", "Basic " + window.btoa(twilioSID + ':' + twilioAut));

    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText));
      }
    }

    xhr.send();
  });
}

// SendSMS triggers the twilio account identified by twilioSID and twilioAuth to send a SMS msg from
// srcNum to dstNum.
function SendSMS(twilioSID, twilioAuth, dstNum, srcNum, msg) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST",
           'https://api.twilio.com/2010-04-01/Accounts/' + twilioSID + '/Messages.json',
           true);

	// Set the HTTP request headers.
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Authorization", "Basic " + window.btoa(twilioSID + ':' + twilioAuth));

  // Callback that is triggered when the request is completed.
	xhr.onreadystatechange = function() {
  	if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
    	// Request finished. Do processing here.
  	}
	}

	var body = 'To=' + dstNum + '&From=' + srcNum + '&Body=' + msg;
	xhr.send(encodeURI(body));
}

// Switchboard updates the state of the application by applying the supplied action.
function Switchboard(state, action) {
 	if (state === undefined) {
 		return initialState;
 	}

 	switch (action.type) {
 		case 'ADD_NUMBER':
 			return {
 				numbers: state.numbers.concat([action.number]),
 				messages: state.messages,
 				selectedNums: state.selectedNums,
 				twilioSID: state.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies
 			};

 		case 'ADD_MESSAGE':
 			return {
 				numbers: state.numbers,
 				messages: state.messages.concat([action.message]),
 				selectedNums: state.selectedNums,
 				twilioSID: state.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies
 			};

 		case 'SELECT_NUMBERS':
 			return {
 				numbers: state.numbers,
 				messages: state.messages,
 				selectedNums: action.numbers,
 				twilioSID: state.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies
 			};

 		case 'LOAD_SETTINGS':
 			var data = JSON.parse(action.contents);

 			return {
 				numbers: data.numbers,
 				messages: data.messages,
 				selectedNums: data.selectedNums,
 				twilioSID: data.twilioSID,
 				twilioAut: data.twilioAut,
 				twilioNum: data.twilioNum,
        replies: state.replies
 			};

 		case 'SET_TWILIOSID':
 			return {
 				numbers: state.numbers,
 				messages: state.messages,
 				selectedNums: state.selectedNums,
 				twilioSID: action.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies
 			};

 		case 'SET_TWILIOAUT':
 			return {
 				numbers: state.numbers,
 				messages: state.messages,
 				selectedNums: state.selectedNums,
 				twilioSID: state.twilioSID,
 				twilioAut: action.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies
 			};

 		case 'SET_TWILIONUM':
 			return {
 				numbers: state.numbers,
 				messages: state.messages,
 				selectedNums: state.selectedNums,
 				twilioSID: state.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: action.twilioNum,
        replies: state.replies
 			};

    case 'SET_REPLIES':
      return {
        numbers: state.numbers,
        messages: state.messages,
        selectedNums: state.selectedNums,
        twilioSID: state.twilioSID,
        twilioAut: state.twilioAut,
        twilioNum: state.twilioNum,
        replies: action.replies
      };

 		default:
 			return state;
 	}
 }

 export { Switchboard, SendSMS, GetSMS }