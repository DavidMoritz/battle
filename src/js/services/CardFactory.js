mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			hearts: [
				{
					id: 'HB0',
					value: 0,
					class: 'king',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB1',
					value: 1,
					class: 'ace',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB2',
					value: 2,
					class: 'two',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB3',
					value: 3,
					class: 'three',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB4',
					value: 4,
					class: 'four',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB5',
					value: 5,
					class: 'five',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB6',
					value: 6,
					class: 'six',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB7',
					value: 7,
					class: 'seven',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB8',
					value: 8,
					class: 'eight',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB9',
					value: 9,
					class: 'nine',
					color: 'hearts',
					played: false
				},
				{
					id: 'HB10',
					value: 10,
					class: 'ten',
					color: 'hearts',
					played: false
				}
			],
			spades: [
				{
					id: 'SB0',
					value: 0,
					class: 'king',
					color: 'spades',
					played: false
				},
				{
					id: 'SB1',
					value: 1,
					class: 'ace',
					color: 'spades',
					played: false
				},
				{
					id: 'SB2',
					value: 2,
					class: 'two',
					color: 'spades',
					played: false
				},
				{
					id: 'SB3',
					value: 3,
					class: 'three',
					color: 'spades',
					played: false
				},
				{
					id: 'SB4',
					value: 4,
					class: 'four',
					color: 'spades',
					played: false
				},
				{
					id: 'SB5',
					value: 5,
					class: 'five',
					color: 'spades',
					played: false
				},
				{
					id: 'SB6',
					value: 6,
					class: 'six',
					color: 'spades',
					played: false
				},
				{
					id: 'SB7',
					value: 7,
					class: 'seven',
					color: 'spades',
					played: false
				},
				{
					id: 'SB8',
					value: 8,
					class: 'eight',
					color: 'spades',
					played: false
				},
				{
					id: 'SB9',
					value: 9,
					class: 'nine',
					color: 'spades',
					played: false
				},
				{
					id: 'SB10',
					value: 10,
					class: 'ten',
					color: 'spades',
					played: false
				}
			],
			diamonds: [
				{
					id: 'DB0',
					value: 0,
					class: 'king',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB1',
					value: 1,
					class: 'ace',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB2',
					value: 2,
					class: 'two',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB3',
					value: 3,
					class: 'three',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB4',
					value: 4,
					class: 'four',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB5',
					value: 5,
					class: 'five',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB6',
					value: 6,
					class: 'six',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB7',
					value: 7,
					class: 'seven',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB8',
					value: 8,
					class: 'eight',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB9',
					value: 9,
					class: 'nine',
					color: 'diamonds',
					played: false
				},
				{
					id: 'DB10',
					value: 10,
					class: 'ten',
					color: 'diamonds',
					played: false
				}
			],
			clubs: [
				{
					id: 'CB0',
					value: 0,
					class: 'king',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB1',
					value: 1,
					class: 'ace',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB2',
					value: 2,
					class: 'two',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB3',
					value: 3,
					class: 'three',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB4',
					value: 4,
					class: 'four',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB5',
					value: 5,
					class: 'five',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB6',
					value: 6,
					class: 'six',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB7',
					value: 7,
					class: 'seven',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB8',
					value: 8,
					class: 'eight',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB9',
					value: 9,
					class: 'nine',
					color: 'clubs',
					played: false
				},
				{
					id: 'CB10',
					value: 10,
					class: 'ten',
					color: 'clubs',
					played: false
				}
			],
			resources: [
				{
					id: 'JC09',
					class: 'Joseph Barter',
					symbol: 'fur',
					description: 'Pay 1 Canoe and move your Scout 5 spaces forward on the River.',
					story: 'Also known as La Liberté, a private in the U.S. Army before being assigned duties as a boatman. However, he deserts soon afterwards.',
					strength: 1,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 5 river for 1 canoe.',
						benefit: {
							river: 5
						}
					}]
				}, {
					id: 'JC04',
					class: 'Ebenezer Tuttle',
					symbol: 'fur',
					description: 'Pay 1 Wood and take 1 Canoe.',
					story: 'Private, recruited for the first part of the expedition up to Fort Mandan. He is sent back to Saint Louis with Pierre Chouteau’s party of fur traders.',
					strength: 1,
					abilities: [{
						cost: {
							wood: 1
						},
						short: 'receive 1 canoe for 1 wood',
						benefit: {
							canoe: 1
						}
					}]
				}, {
					id: 'JC05',
					class: 'René Jessaume',
					symbol: 'fur',
					description: 'Pay 3 Furs and take 1 Horse.',
					story: 'He lived with his Indian wife and children in the Mandan chief ’s village. He helps the captains by providing them with information about the various chiefs and tribal politics.',
					strength: 1,
					abilities: [{
						cost: {
							fur: 3
						},
						short: 'receive 1 horse for 3 fur.',
						benefit: {
							horse: 1
						}
					}]
				}, {
					id: 'JC07',
					class: 'Moses B. Reed',
					symbol: 'fur',
					description: 'Pay 2 Wood and move your Scout 2 spaces forward on the River.',
					story: 'Private, discharged from the Corps for having deserted and stolen weapons.',
					strength: 1,
					abilities: [{
						cost: {
							wood: 2
						},
						short: 'travel 2 river for 2 wood.',
						benefit: {
							river: 2
						}
					}]
				}, {
					id: 'JC24',
					class: 'P. Antoine Tabeau',
					symbol: 'fur',
					description: 'Pay 1 Wood and 1 Food and take 2 Canoes.',
					story: 'French-Canadian fur-trader and explorer; provides useful information about Arikara Indian tribes.',
					strength: 2,
					abilities: [{
						cost: {
							wood: 1,
							meat: 1
						},
						short: 'receive 2 canoes for 1 food and 1 wood.',
						benefit: {
							canoe: 2
						}
					}]
				}, {
					id: 'JC19',
					class: 'John Hay',
					symbol: 'fur',
					description: 'For each Strength that activates this card, choose one of the two resources: Fur or Wood, and collect it. (By activating this card three times, you can, for instance, collect Fur twice and Wood once.)',
					story: 'As a merchant, fur trader, and Cahokia’s post- master, he provides information. Since he speaks French and English, he helps as an interpreter.',
					strength: 2,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					},{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'JC22',
					class: 'Black Moccasin',
					symbol: 'fur',
					description: 'For each Strength that activates this card, choose one of the two resources: Equipment or Food, and collect it. (By activating this card three times, you can, for instance, collect Equipment twice and Food once.)',
					story: 'Minitari chief, he captured Sacagawea from the Shoshone a few years earlier.',
					strength: 2,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					},{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'JC26',
					class: 'Hawk\'s Feather',
					symbol: 'fur',
					description: 'Pay 1 Food and move your Scout 3 spaces forward on the River.',
					story: 'Arikara chief, agrees to attempt peace with the Mandan.',
					strength: 2,
					abilities: [{
						cost: {
							meat: 1
						},
						short: 'travel 3 river for 1 food.',
						benefit: {
							river: 3
						}
					}]
				}, {
					id: 'JC48',
					class: 'Coboway',
					symbol: 'fur',
					description: 'Pay 1 Equipment, 1 Food, 1 Fur and 1 Wood and move your Scout 4 spaces forward in the Mountains.',
					story: 'He is the only Clatsop leader to make recorded contact with the Expedition. He exchanges some goods, including a sea otter pelt, for fish hooks and a small bag of Shoshone tobacco.',
					strength: 3,
					abilities: [{
						cost: {
							equipment: 1,
							fur: 1,
							meat: 1,
							wood: 1
						},
						short: 'travel 4 mountain for 1 of each basic.',
						benefit: {
							mountain: 4
						}
					}]
				}, {
					id: 'JC47',
					class: 'Old Toby',
					symbol: 'fur',
					description: 'Pay 1 Canoe and 1 Horse and move your Scout 6 spaces forward, either on the River or in the Mountains; not both! If activated more than once, each multiple of 6 can be either River or Mountains.',
					story: 'Shoshone guide, he is sent by Cameahwait to lead the Expedition across the Rockies. He guides Clark’s exploration of the Salmon River.',
					strength: 3,
					abilities: [{
						cost: {
							canoe: 1,
							horse: 1
						},
						short: 'travel 6 river for 1 canoe, and 1 horse.',
						benefit: {
							river: 6
						}
					},{
						cost: {
							canoe: 1,
							horse: 1
						},
						short: 'travel 6 mountain for 1 canoe, and 1 horse.',
						benefit: {
							mountain: 6
						}
					}]
				}, {
					id: 'JC41',
					class: 'Cameahwait',
					symbol: 'fur',
					description: 'Pay 1 Canoe and take 1 Horse or pay 1 Horse and take 1 Canoe.',
					story: 'Shoshone chief, he is Sacagawea’s brother. He provides Lewis and Clark hospitality and horses to repay them for reuniting him with his long-lost sister.',
					strength: 3,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'receive 1 horse for 1 canoe',
						benefit: {
							horse: 1
						}
					},{
						cost: {
							horse: 1
						},
						short: 'receive 1 canoe for 1 horse',
						benefit: {
							canoe: 1
						}
					}]
				}, {
					id: 'JC10',
					class: 'J. Baptiste Deschamps',
					symbol: 'meat',
					description: 'Pay 1 Food and 1 Canoe and move your Scout 6 spaces forward on the River.',
					story: 'As a French boatman, he is appointed foreman of the French boatmen in the red pirogue. He is among the men who, in April, 1805, navigate the keelboat downriver to St. Louis.',
					strength: 1,
					abilities: [{
						cost: {
							canoe: 1,
							meat: 1
						},
						short: 'travel 6 river for 1 canoe and 1 food.',
						benefit: {
							river: 6
						}
					}]
				}, {
					id: 'JC11',
					class: 'John Newman',
					symbol: 'wood',
					story: 'Recruited at Fort Massac, he is expelled from the expedition following his court-martial for (having uttered repeated expressions of a highly criminal and mutinous nature.',
					description: 'Pay 1 Food and move your Scout 1 space forward on the River or in the Mountains.',
					strength: 1,
					abilities: [{
						cost: {
							meat: 1
						},
						short: 'travel 1 river for 1 food.',
						benefit: {
							river: 1
						}
					},{
						cost: {
							meat: 1
						},
						short: 'travel 1 mountain for 1 food.',
						benefit: {
							mountain: 1
						}
					}]
				}, {
					id: 'JC42',
					class: 'Broken Arm',
					symbol: 'meat',
					description: 'Pay 1 Equipment and take 1 Horse.',
					stroy: 'Nez Perce chief. Honest and generous, he gives the Corps horses and desires to make peace with the Shoshone.',
					strength: 3,
					abilities: [{
						cost: {
							equipment: 1
						},
						short: 'receive 1 horse for 1 equipment.',
						benefit: {
							horse: 1
						}
					}]
				}, {
					id: 'JC32',
					class: 'James Mackay',
					symbol: 'meat',
					description: 'Pay 1 Horse and move your Scout forward 3 spaces, either on the River or in the Mountains; not both! If activated more than once, each multiple of 3 can be either River or Mountains.',
					story: 'Fur trader, explorer, Scotsman, (perhaps the most widely travelled of the many traders met), he is the creator of the most complete Missouri River map used by Lewis & Clark.',
					strength: 2,
					abilities: [{
						cost: {
							horse: 1
						},
						short: 'travel 3 mountain for 1 horse',
						benefit: {
							mountain: 3
						}
					},{
						cost: {
							horse: 1
						},
						short: 'travel 3 river for 1 horse',
						benefit: {
							river: 3
						}
					}]
				}, {
					id: 'JC21',
					class: 'Dickson & Hancock',
					symbol: 'meat',
					description: 'For each Strength that activates this card, choose one of the two resources: Food or Fur, and collect it. (By activating this card three times, you can, for instance, collect Food twice and Fur once.)',
					story: 'Fur trappers, they meet the expedition in September,1806, during its return to Washington. They invite John Colter to join them as a trapper.',
					strength: 2,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					},{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}, {
					id: 'JC38',
					class: 'Hugh Heney',
					symbol: 'meat',
					description: 'For each Strength that activates this card, choose one of the three resources: Fur, Food or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Fur once, Food once and Wood once.)',
					story: 'Canadian fur trader, a «very sensible, intelligent man», he knows the Teton Sioux like no other white man. Heney sends some snakebite medicine to Lewis & Clark.',
					strength: 3,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					},{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					},{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'JC03',
					class: 'Buffalo Medicine',
					symbol: 'equipment',
					description: 'Pay 1 Food and take 1 Canoe.',
					story: 'Teton Sioux third chief, involved in a power struggle. He meets the Expedition on the Bad River in September, 1804.',
					strength: 1,
					abilities: [{
						cost: {
							meat: 1
						},
						short: 'receive 1 canoe for 1 food.',
						benefit: {
							canoe: 1
						}
					}]
				}, {
					id: 'JC13',
					class: 'John Dame',
					symbol: 'equipment',
					description: 'Pay 2 Wood and move your Scout 1 space forward in the Mountains.',
					story: 'Aged 19, fair-haired and blue-eyed, he joins the Corps for the 1rst part of the journey and comes back to Saint Louis in the spring of 1805. He has shot a white pelican.',
					strength: 1,
					abilities: [{
						cost: {
							wood: 2
						},
						short: 'travel 1 mountain for 2 wood.',
						benefit: {
							mountain: 1
						}
					}]
				}, {
					id: 'JC12',
					class: 'Charles Mackenzie',
					symbol: 'equipment',
					description: 'Pay 1 Fur and 1 Horse and move your Scout 3 spaces forward in the Mountains.',
					story: 'Fur trader, he works for the North West Company. Along with Larocque, he is a frequent visitor to Fort Mandan during the winter of 1804-1805.',
					strength: 1,
					abilities: [{
						cost: {
							horse: 1,
							fur: 1
						},
						short: 'travel 6 river for 1 canoe and 1 food.',
						benefit: {
							mountain: 3
						}
					}]
				}, {
					id: 'JC20',
					class: 'Big White',
					symbol: 'equipment',
					description: 'For each Strength that activates this card, choose one of the two resources: Equipment or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Equipment twice and Wood once.)',
					story: 'He is the principal chief of the lower Mandan village, nicknamed this way because of his size and complexion. He meets President Jefferson in Washington after the expedition',
					strength: 2,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					},{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}, {
					id: 'JC34',
					class: 'Pierre Dorion',
					symbol: 'equipment',
					description: 'Pay 3 Furs and move your Scout forward 2 spaces in the Mountains.',
					story: 'Married to a Yankton woman, he joins the expedition as an interpreter. In April 1805, he is sent back to St.Louis with chiefs of the Yankton, Omaha, Oto & Missouri tribes.',
					strength: 2,
					abilities: [{
						cost: {
							fur: 3
						},
						short: 'receive 1 horse for 1 equipment.',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'JC43',
					class: 'Comcomly',
					symbol: 'equipment',
					description: 'Pay 1 Equipment, 1 Food, 1 Fur and 1 Wood and move your Scout 7 spaces forward on the River.',
					story: 'Chinook chief, most powerful leader at the mouth of the Columbia, he is described as «a shrewd old savage with but one eye». He is friendly to the white explorers.',
					strength: 3,
					abilities: [{
						cost: {
							equipment: 1,
							fur: 1,
							wood: 1,
							meat: 1
						},
						short: 'travel 7 river for 1 of each basic',
						benefit: {
							river: 7
						}
					}]
				}, {
					id: 'JC37',
					class: 'Régis Loisel',
					symbol: 'equipment',
					description: 'For each Strength that activates this card, choose one of the three resources: Equipment, Food or Wood. Then collect it. (By activating this card three times, you can, for instance, collect Equipment once, Food once and Wood once.)',
					story: 'French-Canadian fur trader and explorer at La Charette, on the Missouri River.',
					strength: 3,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					},{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					},{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'JC49',
					class: 'Crow At Rest',
					symbol: 'equipment',
					description: 'Pay 2 Furs and 2 Equipment and move your Scout 3 spaces forward in the Mountains.',
					story: 'Grand Arikara chief, he is interested in trading buffalo skin. He assures the Corps that the Arikara would let them travel on in safety and that peace with the Mandan is desirable.',
					strength: 3,
					abilities: [{
						cost: {
							equipment: 2,
							fur: 2
						},
						short: 'travel 3 mountain for 2 equipment and 2 fur.',
						benefit: {
							mountain: 3
						}
					}]
				}, {
					id: 'JC08',
					class: 'John Robertson',
					symbol: 'wood',
					description: 'Pay 2 Equipment and move your Scout 3 spaces forward on the River.',
					story: 'Initially a corporal, Clark demotes him for having (no authority) over his men and failing to stop a fight at Camp Dubois. He’s probably the first man to leave the expedition.',
					strength: 1,
					abilities: [{
						cost: {
							equipment: 2
						},
						short: 'travel 3 river for 2 equipment.',
						benefit: {
							river: 3
						}
					}]
				}, {
					id: 'JC25',
					class: 'Three Eagles',
					symbol: 'wood',
					description: 'Pay 2 Equipment and take 1 Horse.',
					story: 'Flathead chief, he meets the party in September, 1805, and welcomes, feeds, and swaps horses with the Corps of Discovery.',
					strength: 2,
					abilities: [{
						cost: {
							equipment: 2
						},
						short: 'receive 1 horse for 2 equipment.',
						benefit: {
							horse: 1
						}
					}]
				}, {
					id: 'JC27',
					class: 'Man Crow',
					symbol: 'wood',
					description: 'Pay 3 Wood and move your Scout 4 spaces forward on the River.',
					story: 'Arikara chief, challenger to Crow at Rest’s civil authority',
					strength: 2,
					abilities: [{
						cost: {
							wood: 3
						},
						short: 'travel 4 river for 3 wood.',
						benefit: {
							river: 4
						}
					}]
				}, {
					id: 'JC40',
					class: 'Twisted Hair',
					symbol: 'wood',
					description: 'Pay 1 Canoe and take 2 Canoes. If you activate this Character several times, you are not allowed to use the resources you get as a result of the first (or second) activation to trigger the next Action. You must use Canoes that had been previously held.',
					story: 'Nez Perce chief, a «cheerful man with apparent sincerity», helps build dugout canoes',
					strength: 3,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'receive 2 canoes for 1 canoe.',
						benefit: {
							canoe: 2
						}
					}]
				}
			],
			winner: [],
			get allCards() {
				return [].concat(this.spades, this.hearts, this.diamonds, this.clubs, this.resources, this.winner);
			}
		};
	}
]);