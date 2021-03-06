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

import tk from 'timekeeper';
import expect from 'expect';
import { Map } from 'immutable';
import { List } from 'immutable';
import { Switchboard } from '../../src/reducers';

let time;
beforeEach(() => {
    time = new Date(1499312302843);
    tk.freeze(time);
})

afterEach(() => {
    tk.reset();
})

describe('reducers', () => {
    describe('Switchboard', () => {
        it('should provide the initial state', () => {
            expect(
                Switchboard(undefined, {})
            ).toEqual({numbers:Map({}),
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started:Date.now()});
        })

        it('should be able to add a number', () => {
            expect(Switchboard({numbers:Map({}),
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'ADD_NUMBER', number: '+5551'})
            ).toEqual({numbers:Map({'+5551':0}),
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set a batch of numbers', () => {
            expect(Switchboard({numbers:Map({'+5551':0}),
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'LOAD_NUMBERS', numbers: Map({'+5552':0})})
            ).toEqual({numbers:Map({'+5551':0, '+5552':0}),
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set replied', () => {
            expect(Switchboard({numbers:Map({'+5551':0}),
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({'a': {'sid':'a', 'text':'12', 'replied': false},
                                             'b': {'sid':'b', 'text':'12', 'replied': false},
                                             'c': {'sid':'c', 'text':'12', 'replied': false}}),
                                selectedNums:[],
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'SET_REPLIED', sid:List(['a', 'c']) })
            ).toEqual({numbers:Map({'+5551':0}),
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({'a': {'sid':'a', 'text':'12', 'replied': true},
                                    'b': {'sid':'b', 'text':'12', 'replied': false},
                                    'c': {'sid':'c', 'text':'12', 'replied': true}}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set depth', () => {
            expect(Switchboard({numbers:Map({'+5551':0}),
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({'a': {'sid':'a', 'text':'12', 'replied': false},
                                             'b': {'sid':'b', 'text':'12', 'replied': false},
                                             'c': {'sid':'c', 'text':'12', 'replied': false}}),
                                selectedNums:[],
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'SET_DEPTH', number: '+5551', depth: 2, sid:List(['a', 'c']) })
            ).toEqual({numbers:Map({'+5551':2}),
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({'a': {'sid':'a', 'text':'12', 'replied': true},
                                    'b': {'sid':'b', 'text':'12', 'replied': false},
                                    'c': {'sid':'c', 'text':'12', 'replied': true}}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to mark first sent', () => {
            expect(Switchboard({numbers:[],
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'BROADCAST'})
            ).toEqual({numbers:[],
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:1,
                       started: Date.now()})
        })

        it('should be able to load settings', () => {
            expect(Switchboard({numbers:[],
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'LOAD_SETTINGS',
                                contents:'{"numbers": {"+614": 0},"msgBroadcast":[],"msgTree":[],"twilioSID":"AC","twilioAut":"46","twilioNum":"+61"}'})
            ).toEqual({numbers:Map({'+614':0}),
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'46',
                       twilioNum:'+61',
                       twilioSID:'AC',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set twilio sid', () => {
            expect(Switchboard({numbers:[],
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'SET_TWILIOSID', twilioSID: 'ab'})
            ).toEqual({numbers:[],
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'ab',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set twilio aut', () => {
            expect(Switchboard({numbers:[],
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'SET_TWILIOAUT', twilioAut: 'ab'})
            ).toEqual({numbers:[],
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'ab',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set twilio num', () => {
            expect(Switchboard({numbers:[],
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'SET_TWILIONUM', twilioNum: '12'})
            ).toEqual({numbers:[],
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({}),
                       twilioAut:'',
                       twilioNum:'12',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })

        it('should be able to set the list of replies', () => {
            expect(Switchboard({numbers:[],
                                msgBroadcast:[],
                                msgTree:[],
                                replies:Map({}),
                                selectedNums:[],
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                broadcast:0,
                                started: Date.now()},
                               {type: 'SET_REPLIES', replies: List([{'sid':'a', 'text':'12'}, {'sid':'b', 'text':'12'}])})
            ).toEqual({numbers:[],
                       msgBroadcast:[],
                       msgTree:[],
                       replies:Map({'a': {'sid':'a', 'text':'12', 'replied': false}, 'b': {'sid':'b', 'text':'12', 'replied': false}}),
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       broadcast:0,
                       started: Date.now()})
        })
    })
 })