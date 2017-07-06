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
                       msgTree:[],
                       replies:{},
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       firstSent:false,
                       started:Date.now()});
        })

        it('should be able to add a number', () => {
            expect(Switchboard({numbers:Map({}),
                                msgTree:[],
                                replies:{},
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'ADD_NUMBER', number: '+5551'})
            ).toEqual({numbers:Map({'+5551':0}),
                       msgTree:[],
                       replies:{},
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       firstSent: false,
                       started: Date.now()})
        })

        it('should be able to set depth', () => {
            expect(Switchboard({numbers:Map({'+5551':0}),
                                msgTree:[],
                                replies:{'a': {'sid':'a', 'text':'12', 'replied': false}, 'b': {'sid':'b', 'text':'12', 'replied': false}},
                                selectedNums:[],
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'SET_DEPTH', number: '+5551', depth: 2, sid: 'a'})
            ).toEqual({numbers:Map({'+5551':2}),
                       msgTree:[],
                       replies:{'a': {'sid':'a', 'text':'12', 'replied': true}, 'b': {'sid':'b', 'text':'12', 'replied': false}},
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       firstSent: false,
                       started: Date.now()})
        })

        it('should be able to mark first sent', () => {
            expect(Switchboard({numbers:[],
                                msgTree:[],
                                replies:{},
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'FIRST_SENT'})
            ).toEqual({numbers:[],
                       msgTree:[],
                       replies:{},
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       firstSent: true,
                       started: Date.now()})
        })

        it('should be able to load settings', () => {
            expect(Switchboard({numbers:[],
                                msgTree:[],
                                replies:{},
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'LOAD_SETTINGS',
                                contents:'{"numbers": {"+614": 0},"msgTree":[],"twilioSID":"AC","twilioAut":"46","twilioNum":"+61"}'})
            ).toEqual({numbers:Map({'+614':0}),
                       msgTree:[],
                       replies:{},
                       twilioAut:'46',
                       twilioNum:'+61',
                       twilioSID:'AC',
                       firstSent: false,
                       started: Date.now()})
        })

        it('should be able to set twilio sid', () => {
            expect(Switchboard({numbers:[],
                                msgTree:[],
                                replies:{},
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'SET_TWILIOSID', twilioSID: 'ab'})
            ).toEqual({numbers:[],
                       msgTree:[],
                       replies:{},
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'ab',
                       firstSent: false,
                       started: Date.now()})
        })

        it('should be able to set twilio aut', () => {
            expect(Switchboard({numbers:[],
                                msgTree:[],
                                replies:{},
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'SET_TWILIOAUT', twilioAut: 'ab'})
            ).toEqual({numbers:[],
                       msgTree:[],
                       replies:{},
                       twilioAut:'ab',
                       twilioNum:'',
                       twilioSID:'',
                       firstSent: false,
                       started: Date.now()})
        })

        it('should be able to set twilio num', () => {
            expect(Switchboard({numbers:[],
                                msgTree:[],
                                replies:{},
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'SET_TWILIONUM', twilioNum: '12'})
            ).toEqual({numbers:[],
                       msgTree:[],
                       replies:{},
                       twilioAut:'',
                       twilioNum:'12',
                       twilioSID:'',
                       firstSent: false,
                       started: Date.now()})
        })

        it('should be able to set the list of replies', () => {
            expect(Switchboard({numbers:[],
                                msgTree:[],
                                replies:{},
                                selectedNums:[],
                                twilioAut:'',
                                twilioNum:'',
                                twilioSID:'',
                                firstSent: false,
                                started: Date.now()},
                               {type: 'SET_REPLIES', replies: {"messages" : [{'sid':'a', 'text':'12'}, {'sid':'b', 'text':'12'}]}})
            ).toEqual({numbers:[],
                       msgTree:[],
                       replies:{'a': {'sid':'a', 'text':'12', 'replied': false}, 'b': {'sid':'b', 'text':'12', 'replied': false}},
                       twilioAut:'',
                       twilioNum:'',
                       twilioSID:'',
                       firstSent: false,
                       started: Date.now()})
        })
    })
 })