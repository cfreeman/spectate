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
import MessageButton from './MessageButton.jsx'

var MessageLog = React.createClass({
    render: function() {
        const { store } = this.context;
        var state = store.getState();

        console.log(state.replies);

        // Build a set of colors to identify each conversation.
        var seq = palette('tol-rainbow', state.numbers.size);
        var colorMap = state.numbers.mapEntries(function(e, i) {
            console.log(e[0]);
            return [e[0], "#"+seq[i]];
        });

        // Filter out all messages that were sent before the page loaded.
        var valid = state.replies.filter(function(v, k, i) {
            return Date.parse(v.date_sent) > state.started;
        });

        // Filter outbound messages that come from a different number.
        valid = valid.filterNot(function(v, k, i) {
             return (v.direction == 'outbound-api' && v.from != state.twilioNum);
        });

        console.log(valid);

        var replies = [];

        valid.map(function(reply) {
            var direction = ['Sent', 'to'];
            var dst = reply.to;
            var btns = "";

            // Many of the operations only apply to inbound messages.
            if (reply.direction == 'inbound') {
                direction = ['Recieved', 'from'];
                dst = reply.from

                var pos = state.msgTree[state.numbers.get(dst)]
                if (pos === undefined) {
                    // Unknown number. Ignore message.
                    return;
                }

                if (!reply.replied) {
                    var btns = pos.children.map(function(id) {
                        if (state.msgTree[id] === undefined) {
                            console.log("Unable to find Message: " + id);
                            return;
                        }

                        return <MessageButton key={msg} number={dst} sid={reply.sid} depth={id} message={state.msgTree[id].text} />;
                    })
                }
            }

            replies.push(
            <p className="log"><b style={{color:colorMap.get(dst)}}>&#9608;&#9608;&#9608;</b> {direction[0]} <b>'{reply.body}'</b> {direction[1]} {dst}. {btns}</p>);

        })

        // Display the initial button for starting the performance.
        var button = null
        if (state.msgTree.length != 0) {
            var msg = state.msgTree[0].text;
            button = <MessageButton key={msg} message={msg} first={state.firstSent} />
        }

        return (
            <div className="pure-u-1-1">
                <h2>Message Flow:</h2>
                { button }
                { replies }
            </div>
        )
    }
})
MessageLog.contextTypes = {
    store: React.PropTypes.object
};

export default MessageLog