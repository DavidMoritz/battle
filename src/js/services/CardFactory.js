mainApp.factory('CardFactory', [
	function CardFactory() {
		'use strict';

		return {
			boardSpaces: [
				{
					event: 'boardCollectMeatFur',
					class: 'right',
					max: 1,
					description: 'Collect 1 food and 1 fur'
				},{
					event: 'boardCollectEquipmentWood',
					max: 1,
					description: 'Collect 1 equipment and 1 wood'
				},{
					event: 'boardCollectChoice',
					class: 'left',
					max: 1,
					description: 'Collect 2 fur or 2 wood'
				},{
					event: 'boardCollectCanoe',
					class: 'left',
					max: 20,
					allow: 3,
					description: 'Collect 1 canoe for 2 wood. May be used 3 times.'
				},{
					event: 'boardPowWow',
					class: 'center',
					max: 0,
					description: 'Indians dance the pow-wow here'
				},{
					event: 'boardResetJournal',
					class: 'right',
					max: 1,
					description: 'Remove all recruit cards from journal. May trash up to 3 cards from hand.'
				},{
					event: 'boardCollectHorse',
					class: 'center',
					max: 20,
					allow: 3,
					description: 'Collect 1 horse for 3 different items. May be used 3 times.'
				},{
					event: 'boardUseAbility',
					max: 1,
					description: 'For 1 food, use any ability of a played card in front of any player. The action may only be executed once.'
				},{
					event: 'boardCollectBoat',
					class: 'center',
					max: 2,
					description: 'Collect 1 boat for 3 wood. 4 possible boats. Small Supply: 2 slots free. Big Supply: 5 slots for 1 day. Small Indian: 1 slot free. Big Indian: 3 slots for 1 day.'
				}
			],
			lightblue: [
				{
					id: 'SP11',
					name: 'Meriweather Lewis',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Captain of the U.S. Army and personal secretary to the President, he is chosen by President Jefferson to command the Expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP12',
					name: 'Pierre Cruzatte',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'Thanks to his French father and his Omaha mother he speaks 3 languages and is skilled in sign language. He is an expert riverman. He entertains the explorers with his fiddle-playing.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP13',
					name: 'Hugh McNeal',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'Almost killed by a Tillamook Indian during a romantic assignation. On the return trip, he surprises a grizzly and has to scurry up a willow tree and wait for the bear to leave.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP14',
					name: 'Seamor',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'Lewis’ black Newfoundland dog, he is the only animal to complete the entire trip. He hunts for food and provides warnings.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP15',
					name: 'Alexander H. Willard',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'He has a powerful physique and serves the expedition as blacksmith and gunsmith. He is able to repair equipment and make tools for trading with the Indians.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP16',
					name: 'Richard Windsor',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'He is a great hunter and woodsman. Crossing a bluff, he slips and starts to fall down its edge. Lewis runs and tells him to dig his knife in and climb up. He does so, and escapes death.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			lightsalmon: [
				{
					id: 'SP21',
					name: 'William Clark',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Lieutenant during the Northwest Indian War, he is recruited by his friend Lewis when he is 33 to share command of the newly formed Corps of Discovery.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP22',
					name: 'François Labiche',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'Recruited as an enlisted member of the Corps, he is an experienced boatman and Indian trader. He speaks English, French and several Indian languages.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP23',
					name: 'John B. Thompson',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He serves as a cook and creates maps. He goes out with several elk-hunting parties to “cure” meat in the field--a nearly essential skill in a damp climate.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP24',
					name: 'York',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'Clark’s manservant, he plays a key role in diplomatic relations. Because of his appearance, the Indians suspect he has magical powers. He saves Lewis from a grizzly bear.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP25',
					name: 'Joseph Whitehouse',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'He serves as a tailor and keeps a journal. He is almost killed on the Jefferson River.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP26',
					name: 'Joseph & Ruben Field',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'They are brothers, two of the «Nine Young Men from Kentucky». Healthy and lucky, they are two of the top hunters of the expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			lightgreen: [
				{
					id: 'SP31',
					name: 'Nathaniel Pryor',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Described by the captains as «a man of character and ability», he is one of the «Nine Young Men from Kentucky». He supervises the carpentry at Camp Dubois.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP32',
					name: 'George Gibson',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'He enlists as one of the “Nine Young Men from Kentucky” in 1803 and is a fine hunter and horseman and also plays the fiddle. He has some skills in sign language.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP33',
					name: 'Patrick Gass',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He is one of the best hunters in the group, and is routinely sent out alone to scout the surrounding countryside for game. He is considered to be one of the first mountain men.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP34',
					name: 'John Colter',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'He is elected Sergeant after Floyd’s death. As a carpenter, he heads the construction of the Corps’ winter quarters, hews dugout canoes, and builds wagons to portage the canoes.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP35',
					name: 'William Bratton',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'Skilled blacksmith from Kentucky, he is over six feet tall and square-built. He has been suffering an extreme pain in his lower back for months and is cured in an Indian sweat lodge.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP36',
					name: 'Peter Weiser',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'He serves as quartermaster, cook, and hunter. He is one of the Corps’ best shots .While the expedition is at Fort Clatsop, he is part of the salt-making detail on the Oregon coast.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			orchid: [
				{
					id: 'SP41',
					name: 'Charles Floyd',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Quartermaster, he dies in August 1804 because of a fatal appendicitis. He is buried on a bluff overlooking the Missouri River in Iowa. He is he only person to die on the expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP42',
					name: 'J. Baptiste Lepage',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'He is a French-Canadian fur trader who is living among Minitari and Mandan Indians when the expedition arrives here in 1804. He replaces discharged Private John Newman.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP43',
					name: 'Hugh Hall',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He has a penchant for whiskey, which together with other army infractions result in court martial penalties that are not of sufficient severity to dismiss him from the party.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP44',
					name: 'William Werner',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'He serves as a cook and was probably born in Kentucky. Before the expedition, he was disciplined for fighting with John Potts and is court-martialed in 1804 for mutiny.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP45',
					name: 'John Potts',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'German immigrant and miller by trade, he is a trusted member of the party. He nearly drowns, almost bleeds to death when he cuts his leg, and is attacked by a grizzly bear.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP46',
					name: 'John Collins',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: 'Appointed cook for Sgt. Pryor’s mess, his main contribution is as one of the expedition’s best hunters. He captures specimens to scientifically document the Western wildlife.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			khaki: [
				{
					id: 'SP51',
					name: 'John Ordway',
					symbol: 'fur',
					description: 'Travel 2 river for 1 food / travel 4 river for 1 canoe / travel 2 mountain for 1 horse.',
					story: 'Sergeant of the U.S. Army, he is the right-hand man of the captains. In charge of guard duties and issuing provisions, he keeps the most detailed journal of the Expedition.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						cost: {
							canoe: 1
						},
						short: 'travel 4 river for 1 canoe',
						benefit: {
							river: 4
						}
					}, {
						cost: {
							meat: 1
						},
						short: 'travel 2 river for 1 food',
						benefit: {
							river: 2
						}
					}, {
						cost: {
							horse: 1
						},
						short: 'travel 2 mountain for 1 horse',
						benefit: {
							mountain: 2
						}
					}]
				}, {
					id: 'SP52',
					name: 'Robert Frazer',
					symbol: 'wood',
					description: 'Take Indians from the Village and add them to your Expedition. Also trash first journal card.',
					story: 'He joins the Corps of Discovery belatedly, after Moses Reed’s desertion. He keeps a diary and a valuable map.',
					strength: 2,
					played: false,
					plays: 0,
					abilities: [{
						short: 'gather indians and trash journal card.',
						event: 'interpreter'
					}]
				}, {
					id: 'SP53',
					name: 'Thomas P. Howard',
					symbol: 'wood',
					description: 'Collect Wood.',
					story: 'He is a steady member of the expedition, despite having been court-martialed for scaling the Fort Mandan stockade wall when returning from a visit to the Mandan Indian village.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'wood',
						short: 'collect wood.',
						benefit: {}
					}]
				}, {
					id: 'SP54',
					name: 'Silas Goodrich',
					symbol: 'meat',
					description: 'Collect Food.',
					story: 'He is transferred from his army unit to Lewis and Clark’s command in 1804. He is the principal fisherman for the corps, and provides other food when necessary.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'meat',
						short: 'collect food.',
						benefit: {}
					}]
				}, {
					id: 'SP55',
					name: 'John Shields',
					symbol: 'equipment',
					description: 'Collect Equipment.',
					story: 'He is from Virginia and the oldest man of the party, enlisting in 1803 at the age of 34. A talented man, he is head blacksmith, gunsmith, boat builder and general repairman.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'equipment',
						short: 'collect equipment.',
						benefit: {}
					}]
				}, {
					id: 'SP56',
					name: 'George Shannon',
					symbol: 'fur',
					description: 'Collect Fur.',
					story: '18 years old, one of the “Nine Young Men from Kentucky”. He is a good singer, hunter and horseman. He gets lost occasionally, but always manages to find his way back.',
					strength: 1,
					played: false,
					plays: 0,
					abilities: [{
						collect: 'fur',
						short: 'collect fur.',
						benefit: {}
					}]
				}
			],
			journalCards: [
				{
					id: 'JC09',
					name: 'Joseph Barter',
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
					name: 'Ebenezer Tuttle',
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
					name: 'René Jessaume',
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
					name: 'Moses B. Reed',
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
					name: 'P. Antoine Tabeau',
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
					name: 'John Hay',
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
					name: 'Black Moccasin',
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
					name: 'Hawk\'s Feather',
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
					name: 'Coboway',
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
					name: 'Old Toby',
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
					name: 'Cameahwait',
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
					name: 'J. Baptiste Deschamps',
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
					name: 'John Newman',
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
					name: 'Broken Arm',
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
					name: 'James Mackay',
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
					name: 'Dickson & Hancock',
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
					name: 'Hugh Heney',
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
					name: 'Buffalo Medicine',
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
					name: 'John Dame',
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
					name: 'Charles Mackenzie',
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
					name: 'Big White',
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
					name: 'Pierre Dorion',
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
					name: 'Comcomly',
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
					name: 'Régis Loisel',
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
					name: 'Crow At Rest',
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
					name: 'John Robertson',
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
					name: 'Three Eagles',
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
					name: 'Man Crow',
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
					name: 'Twisted Hair',
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
			get allCards() {
				return [].concat(this.lightblue, this.lightsalmon, this.lightgreen, this.orchid, this.khaki, this.journalCards);
			}
		};
	}
]);