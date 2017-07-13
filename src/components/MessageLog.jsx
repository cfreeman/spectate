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

        // Build a set of colors to identify each conversation.
        var seq = palette('tol-rainbow', state.numbers.size);
        var colorMap = state.numbers.mapEntries(function(e, i) {
            console.log(e[0]);
            return [e[0], "#"+seq[i]];
        });

        // Filter out all messages that were sent before the page loaded.
        var valid = state.replies;

        // Filter out all the messages that were sent before the page loaded.
        // Then filter out all the messages except for incoming replies.
        // Then sort the replies by the date/time they where sent.
        valid = valid.filter((v, k, i) => { return Date.parse(v.date_sent) > state.started; })
                     .filter((v, k, i) => { return (v.direction == 'inbound'); })
                     .sort(function (a, b) {
            if (a.date_sent < b.date_sent) { return 1; }
            if (a.date_sent > b.date_sent) { return -1; }
            return 0;
        });

        // Get the SMS's that haven't been replied yet.
        // Then group them by their origin number and build a list of reply controls.
        var controls = valid.filterNot((v, k, i) => { return v.replied; })
                            .groupBy((v) => { return v.from; })
                            .map(function(replies) {

            replies = replies.sort(function(a, b) {
                if (a.date_sent < b.date_sent) { return -1; }
                if (a.date_sent > b.date_sent) { return 1; }
                return 0;
            });

            // Get the buttons to reply to this SMS.
            var srcNum = replies.first().from;
            var pos = state.msgTree[state.numbers.get(srcNum)];
            if (pos === undefined) {
                // Unknown position in message tree.
                console.log("Unable to find Message: " + state.numbers.get(srcNum));
                return;
            }

            var btns = pos.children.map(function(id) {
                if (state.msgTree[id] === undefined) {
                    console.log("Unable to find Message: " + id);
                    return;
                }

                return <MessageButton number={srcNum} sid={replies.map(x => x.sid)} depth={id} message={state.msgTree[id].text} />;
            })

            // Build the HTML for the controls to reply to his SMS.
            return([
            <p className="log">
                <b style={{color:colorMap.get(srcNum)}}>&#9608;&#9608;&#9608;</b>&nbsp;
                Sent '{pos.text}' to {srcNum}.
            </p>,
            replies.map(function(reply) {
                return(
                <p className="log">
                    <b style={{color:colorMap.get(reply.from)}}>&#9608;&#9608;&#9608;</b>&nbsp;
                    Received <b>'{reply.body}'</b> from {reply.from}.
                </p>);
            }),
            <p>{btns}&nbsp;</p>]);
        });

        // Show the rest of the SMS history.
        var history = valid.filter((v, k, i) => { return (v.replied); })
                           .map(function(reply) {
            return (
            <p className="log">
                <b style={{color:colorMap.get(reply.from)}}>&#9608;&#9608;&#9608;</b>&nbsp;
                Received <b>'{reply.body}'</b> from {reply.from}.
            </p>);
        });

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
                { controls }
                { history }
            </div>
        )
    }
})
MessageLog.contextTypes = {
    store: React.PropTypes.object
};

export default MessageLog