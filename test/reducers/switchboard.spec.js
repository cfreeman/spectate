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

 import expect from 'expect';
 import { Switchboard } from '../../src/reducers';

 describe('reducers', () => {
 	describe('Switchboard', () => {
 		it('should provide the initial state', () => {
 			expect(
 				Switchboard(undefined, {})
 			).toEqual({numbers:[],
 					   messages:[],
 					   replies:[],
 					   selectedNums:[],
					   twilioAut:'',
 					   twilioNum:'',
 					   twilioSID:''})
 		})

 		it('should be able to add a number', () => {
 			expect(Switchboard({numbers:[],
 							    messages:[],
 							    replies:[],
 							    selectedNums:[],
 								twilioAut:'',
 								twilioNum:'',
 								twilioSID:''},
 							   {type: 'ADD_NUMBER', number: '5551'})
 			).toEqual({numbers:['5551'],
 					   messages:[],
 					   replies:[],
 					   selectedNums:[],
 					   twilioAut:'',
 					   twilioNum:'',
 					   twilioSID:''})
 		})

 		it('should be able to add a message', () => {
 			expect(Switchboard({numbers:[],
 								messages:[],
 								replies:[],
 								selectedNums:[],
 								twilioAut:'',
 								twilioNum:'',
 								twilioSID:''},
 							  {type: 'ADD_MESSAGE', message: 'This is another message'})
 			).toEqual({numbers:[],
 					   messages:['This is another message'],
 					   replies:[],
 					   selectedNums:[],
 					   twilioAut:'',
 					   twilioNum:'',
 					   twilioSID:''})
 		})

 		it('should be able to select numbers', () => {
 			expect(Switchboard({numbers:['123'],
 								messages:[],
 								replies:[],
 								selectedNums:[],
 								twilioAut:'',
 					   			twilioNum:'',
 					   			twilioSID:''},
 							   {type: 'SELECT_NUMBERS', numbers:['123']})
			).toEqual({numbers:['123'],
					   messages:[],
					   replies:[],
					   selectedNums:['123'],
					   twilioAut:'',
 					   twilioNum:'',
 					   twilioSID:''})
 		})

 		it('should be able to load settings', () => {
 			expect(Switchboard({numbers:[],
 								messages:[],
 								replies:[],
 								selectedNums:[],
 								twilioAut:'',
 					   			twilioNum:'',
 					   			twilioSID:''},
 							   {type: 'LOAD_SETTINGS',
 							   	contents:'{"numbers":["+614"],"messages":["Hello friend"],"selectedNums":[],"twilioSID":"AC","twilioAut":"46","twilioNum":"+61"}'})
			).toEqual({numbers:['+614'],
					   messages:['Hello friend'],
					   replies:[],
					   selectedNums:[],
					   twilioAut:'46',
 					   twilioNum:'+61',
 					   twilioSID:'AC'})
 		})

 		it('should be able to set twilio sid', () => {
 			expect(Switchboard({numbers:[],
 							    messages:[],
 							    replies:[],
 							    selectedNums:[],
 								twilioAut:'',
 								twilioNum:'',
 								twilioSID:''},
 							   {type: 'SET_TWILIOSID', twilioSID: 'ab'})
 			).toEqual({numbers:[],
 					   messages:[],
 					   replies:[],
 					   selectedNums:[],
 					   twilioAut:'',
 					   twilioNum:'',
 					   twilioSID:'ab'})
 		})

 		it('should be able to set twilio aut', () => {
 			expect(Switchboard({numbers:[],
 							    messages:[],
 							    replies:[],
 							    selectedNums:[],
 								twilioAut:'',
 								twilioNum:'',
 								twilioSID:''},
 							   {type: 'SET_TWILIOAUT', twilioAut: 'ab'})
 			).toEqual({numbers:[],
 					   messages:[],
 					   replies:[],
 					   selectedNums:[],
 					   twilioAut:'ab',
 					   twilioNum:'',
 					   twilioSID:''})
 		})

 		it('should be able to set twilio num', () => {
 			expect(Switchboard({numbers:[],
 							    messages:[],
 							    replies:[],
 							    selectedNums:[],
 								twilioAut:'',
 								twilioNum:'',
 								twilioSID:''},
 							   {type: 'SET_TWILIONUM', twilioNum: '12'})
 			).toEqual({numbers:[],
 					   messages:[],
 					   replies:[],
 					   selectedNums:[],
 					   twilioAut:'',
 					   twilioNum:'12',
 					   twilioSID:''})
 		})

 		it('should be able to set the list of replies', () => {
 			expect(Switchboard({numbers:[],
 							    messages:[],
 							    replies:[],
 							    selectedNums:[],
 								twilioAut:'',
 								twilioNum:'',
 								twilioSID:''},
 							   {type: 'SET_REPLIES', replies: ['12', '11']})
 			).toEqual({numbers:[],
 					   messages:[],
 					   replies:['12', '11'],
 					   selectedNums:[],
 					   twilioAut:'',
 					   twilioNum:'',
 					   twilioSID:''})
 		})

 	})
 })