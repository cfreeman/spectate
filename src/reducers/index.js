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

import { fromJS } from 'immutable'
import { Map, List } from 'immutable'

const initialState = {
  numbers:Map({}),
  msgBroadcast:[],
  msgTree:[],
  twilioSID:'',
  twilioAut:'',
  twilioNum:'',
  replies:Map({}),
  broadcast: 0,
  started: null
}

function GetFirstSMSPage(twilioSID, twilioAut, dstNum) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    // Get only messages starting from the beginning of the performance.
    var now = new Date;
    var yr = now.getUTCFullYear();
    var mt = now.getUTCMonth() + 1;
    var dy = now.getUTCDate();

    xhr.open("GET",
             'https://api.twilio.com/2010-04-01/Accounts/' + twilioSID + '/Messages.json?DateSent>='+yr+'-'+mt+'-'+dy+'&PageSize=1000',
             true);
    xhr.setRequestHeader("Authorization", "Basic " + window.btoa(twilioSID + ':' + twilioAut));

    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        var msgs = List(json.messages);

        if (json.next_page_uri) {
          var nextP = GetNextSMSPage(twilioSID, twilioAut, json.next_page_uri, msgs);
          nextP.then(function(allMsgs) {
            resolve(allMsgs);
          });
        } else {
          resolve(msgs);
        }
      }
    }

    xhr.send();
  });
}

function GetNextSMSPage(twilioSID, twilioAut, nextPageURI, existingMessages) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'https://api.twilio.com' + nextPageURI, true);
    xhr.setRequestHeader("Authorization", "Basic " + window.btoa(twilioSID + ':' + twilioAut));

    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {

        var json = JSON.parse(xhr.responseText);
        var msgs = existingMessages.concat(List(json.messages));

        if (json.next_page_uri) {
          var nextP = GetNextSMSPage(twilioSID, twilioAut, json.next_page_uri, msgs);
          nextP.then(function(nextMsgs) {
            resolve(nextMsgs);
          });
        } else {
          resolve(msgs);
        }
      }
    }

    xhr.send();
  });
}

// GetSMS gets all the SMS messages that have been sent to dstNum in the twilio account identified by
// twilioSID and twilioAut. Returns a promise that resolves to parsed JSON.
function GetSMS(twilioSID, twilioAut, dstNum) {
  return GetFirstSMSPage(twilioSID, twilioAut, dstNum);
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
    var i = initialState;
    i.started = Date.now();
 		return initialState;
 	}

 	switch (action.type) {
 		case 'ADD_NUMBER':
 			return {
 				numbers: state.numbers.set(action.number, 0),
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
 				twilioSID: state.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast,
        started: state.started
 			};

    case 'LOAD_NUMBERS':
      return {
        numbers: state.numbers.concat(action.numbers),
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
        twilioSID: state.twilioSID,
        twilioAut: state.twilioAut,
        twilioNum: state.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast,
        started: state.started
      };

    case 'BROADCAST':
      return {
        numbers: state.numbers,
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
        twilioSID: state.twilioSID,
        twilioAut: state.twilioAut,
        twilioNum: state.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast + 1,
        started: state.started
      };

 		case 'LOAD_SETTINGS':
 			var data = JSON.parse(action.contents);

 			return {
 				numbers: fromJS(data.numbers),
        msgBroadcast: data.msgBroadcast,
        msgTree: data.msgTree,
 				twilioSID: data.twilioSID,
 				twilioAut: data.twilioAut,
 				twilioNum: data.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast,
        started: state.started
 			};

 		case 'SET_TWILIOSID':
 			return {
 				numbers: state.numbers,
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
 				twilioSID: action.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast,
        started: state.started
 			};

 		case 'SET_TWILIOAUT':
 			return {
 				numbers: state.numbers,
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
 				twilioSID: state.twilioSID,
 				twilioAut: action.twilioAut,
 				twilioNum: state.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast,
        started: state.started
 			};

 		case 'SET_TWILIONUM':
 			return {
 				numbers: state.numbers,
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
 				twilioSID: state.twilioSID,
 				twilioAut: state.twilioAut,
 				twilioNum: action.twilioNum,
        replies: state.replies,
        broadcast: state.broadcast,
        started: state.started
 			};

    case 'SET_REPLIED':
      var updatedReplies = state.replies;
      action.sid.map(function(s) {
        var reply = updatedReplies.get(s);
        reply.replied = true;
        updatedReplies = updatedReplies.set(s, reply);
      });

      return {
        numbers: state.numbers,
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
        twilioSID: state.twilioSID,
        twilioAut: state.twilioAut,
        twilioNum: state.twilioNum,
        replies: updatedReplies,
        broadcast: state.broadcast,
        started: state.started
      };


    case 'SET_DEPTH':
      var updatedReplies = state.replies;
      action.sid.map(function(s) {
        var reply = updatedReplies.get(s);
        reply.replied = true;
        updatedReplies = updatedReplies.set(s, reply);
      })

      return {
        numbers: state.numbers.set(action.number, action.depth),
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
        twilioSID: state.twilioSID,
        twilioAut: state.twilioAut,
        twilioNum: state.twilioNum,
        replies: updatedReplies,
        broadcast: state.broadcast,
        started: state.started
      };

    case 'SET_REPLIES':
      var newList = Map({});

      action.replies.map(function(reply) {
        if (state.replies.has(reply.sid)) {
          newList = newList.set(reply.sid, state.replies.get(reply.sid));
        } else {
          reply.replied = false;
          newList = newList.set(reply.sid, reply);
        }
      });

      return {
        numbers: state.numbers,
        msgBroadcast: state.msgBroadcast,
        msgTree: state.msgTree,
        twilioSID: state.twilioSID,
        twilioAut: state.twilioAut,
        twilioNum: state.twilioNum,
        replies: newList,
        broadcast: state.broadcast,
        started: state.started
      };

 		default:
 			return state;
 	}
 }

 export { Switchboard, SendSMS, GetSMS }