var Discord = require('discord.io');
var auth = require('./auth.json');
var request = require('request');
var jsonDb = require('simple-json-db');
var db = new jsonDb('./.data/db.json');
var cp = require('child_process');
var velociraptors = { cPs: [] };/*
var raptorTokens = require('./velociraptortokens.json');
velociraptors.cPs.push(cp.fork('./voicebot.js',[''],{env: {TOKEN: raptorTokens[0]}}));
velociraptors.cPs.push(cp.fork('./voicebot.js',[''],{env: {TOKEN: raptorTokens[1]}}));
velociraptors.cPs.push(cp.fork('./voicebot.js',[''],{env: {TOKEN: raptorTokens[2]}}));
for(var i = 0; i < 3; i++) {
    velociraptors.cPs[i].on('message', function(m) {
        if(m.f == 'freeRaptor') {
            if(!velociraptors[m.g]) { return }
            if(!velociraptors[m.g][m.c]) { return }
            delete velociraptors[m.g][m.c]
        }
        
    });
}*/
var voiceSessions = {};
var cp = require('child_process');
const webserver = cp.fork(`${__dirname}/webserver.js`);
var pointCache = {};
var channelActivity = require('./channelactivity.js')(bot,db);
var antiSpam = require('./antispam.js');
var commandManager = require('./commandmanager.js')

var playerVotes = {};
var cfg = {
	cooldown_e: 2,
	cooldown_e_t: 3600000,
	cooldown_s: 5,
	cooldown_s_t: 180000,
	cooldown_m: 20,
	cooldown_m_t: 100,
	spam_time_mins: 10,
	gameEmoji: {
		"Counter-Strike: Global Offensive": "\ud83d\udd2b",
		"Minecraft": "\u26cf\ufe0f",
		"Town of Salem": "\u2696\ufe0f",
		"Tom Clancy's Rainbow Six Siege": "\ud83c\udf08",
		"Besiege": "\ud83d\udcd0",
		"Starmade": "\ud83d\ude80",
		"For Honor": "\u2694\ufe0f",
		"Sid Meier's Civilization V": "\ud83c\udf0d",
		"Rocket League": "\ud83d\ude97"
	},
	nameColorRoles: {

	},
	commonSynonyms: {
		levels: "leaderboard",
		rank: "score",
		xp: "score",
		nametag: "namecolor",
		color: "namecolor",
		get: "getme",
		listnotify: "notifylist",
		name: "namecolor",
		tag: "namecolor",
		points: "score",
		colorname: "namecolor",
		lb: "leaderboard",
		add: "addmeto",
		take: "takemefrom"
	},
	msgs: {
		joinPublic: "Welcome to the server, <@{USER}>!",
		joinPrivate: ""
	},
	enabledFeatures: { "getme": true, "autoorder": true, "notify": true, "addmeto": true, "voicechannelgameemojis": true, "experience": true, "antispam": true, "autoresponse": true, "joinmessages": true, "namecolor": true },
	autoResp: {}
};

console.log('💾 Process launched!');

webserver.on('message', function (m) {
	pointCache = m.c

	if (m.l) {
		var evt = m.e;
		if (!evt) return

		bot.sendMessage({
			to: evt.d.channel_id,
			message: 'Congrats, <@' + evt.d.author.id + '>! You just leveled up to level ' + m.d.discord.data[evt.d.guild_id].level + '\n*This message will be deleted in 10s*'

		}, function (e, r) {
			setTimeout(function () { bot.deleteMessage({ channelID: r.channel_id, messageID: r.id }); }, 10000)
		});

	} else if (m.fn == "giveLinkCode") {
		bot.sendMessage({
			to: m.evt.d.author.id,
			message: 'Your connection code is: ```' + m.code + '```. Alternatively, you can use this link to automatically sign in: \nhttp://fossilbot.cf/lb/' + m.evt.d.guild_id + '?acn=gcn&tcd=' + encodeURIComponent(m.code)

		});

	} else if (m.fn == "setServerConfig") {
		var dbc = db.JSON();
		dbc.config[m.cfg.guild_id] = m.cfg
		db.JSON(dbc);
		db.sync();

	}


});

// Initialize Discord Bot
var bot = new Discord.Client({
	token: auth
});
bot.connect();

//on bot ready
bot.on('ready', function (evt) {
	console.log('📡 Connected');
	console.log('🔑 Logged in as: ' + bot.username + ' - (' + bot.id + ')');
	bot.setPresence({ status: 'online', game: { name: 'with >help' } });
	console.log('📱 Presence set');
});

// Automatically reconnect if the bot disconnects
bot.on('disconnect', function (erMsg, code) {
	console.log('⚠️ Bot disconnected from Discord with code ' + code + ' for reason: ' + erMsg);
	bot.connect();
});

var cmdprefix = ">";
var doRSM = true,
	botenabled = true;
var cfgtrytime = 0;
var createdRoleGlobal;

//Update the name of voice channels when the first person joins
bot.on('voiceStateUpdate', function (evt) {

	var _cfg = cfg;
	if (db.JSON().config[evt.d.guild_id]) { _cfg = db.JSON().config[evt.d.guild_id] }

	if (!_cfg.enabledFeatures.voicechannelgameemojis) { return }

	if (!evt.d.channel_id || voiceSessions[evt.d.user_id]) {
		if (!voiceSessions[evt.d.user_id]) { return }
		evt.d._channel_id = voiceSessions[evt.d.user_id];
		if (Object.keys(bot.channels[evt.d._channel_id].members).length == 0 && bot.channels[evt.d._channel_id].name.substring(0, 3) == '\ud83c\udfae:' && bot.channels[evt.d._channel_id].name.length >= 5) {
			request({
				url: 'https://discordapp.com/api/v6/channels/' + evt.d._channel_id,
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bot ' + auth
				},
				body: '{"name": "' + bot.channels[evt.d._channel_id].name.split('| ').splice(1).join('| ') + '"}'
			}, function (e, r, b) { console.log(r.statusCode) });
		}

		voiceSessions[evt.d.user_id] = null
		if (!evt.d.channel_id) { return }
	}
	voiceSessions[evt.d.user_id] = evt.d.channel_id
	if (!bot.users[evt.d.user_id].game) {
		if (Object.keys(bot.channels[evt.d.channel_id].members).length == 1 && bot.channels[evt.d.channel_id].name.length < 96 && bot.channels[evt.d.channel_id].name.substring(0, 3) != '\ud83c\udfae:') {
			request({
				url: 'https://discordapp.com/api/v6/channels/' + evt.d.channel_id,
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bot ' + auth
				},
				body: '{"name": "' + (('\ud83c\udfae:' + '\ud83c\udf37') + '| ' + bot.channels[evt.d.channel_id].name) + '"}'
			}, function (e, r, b) { console.log(r.statusCode) });
			return
		}
	}
	if (!_cfg.gameEmoji) { _cfg.gameEmoji = { 'foo': 'bar' } }
	if (Object.keys(bot.channels[evt.d.channel_id].members).length == 1 && bot.channels[evt.d.channel_id].name.length < 96 && bot.channels[evt.d.channel_id].name.substring(0, 3) != '\ud83c\udfae:') {
		request({
			url: 'https://discordapp.com/api/v6/channels/' + evt.d.channel_id,
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bot ' + auth
			},
			body: '{"name": "' + ('\ud83c\udfae:' + (_cfg.gameEmoji[bot.users[evt.d.user_id].game.name] || '\ud83c\udfb2') + '| ' + bot.channels[evt.d.channel_id].name) + '"}'
		}, function (e, r, b) { console.log(r.statusCode) });
	}
});

//when people join, do stuff
bot.on('guildMemberAdd', function (member, evt) {

	var _cfg = cfg;
	if (db.JSON().config[evt.d.guild_id]) { _cfg = db.JSON().config[evt.d.guild_id] }

	bot.addToRole({ serverID: evt.d.guild_id, userID: evt.d.user.id, roleID: roleSearchByName(evt, 'New Recruit') }, function (err) { if (err != null && err.statusMessage != 'NOT FOUND') { console.log(err); } });
	if (!_cfg.msgs.joinPublic) { return }
	if (!_cfg.msgs.joinPrivate) { return }
	if (!_cfg.enabledFeatures.joinmessages) { return }
	try {
		bot.sendMessage({
			to: evt.d.guild_id,
			message: _cfg.msgs.joinPublic.replace('{USER}', evt.d.user.id)
		});
	} catch (e) { }
	bot.sendMessage({
		to: evt.d.user.id,
		message: _cfg.msgs.joinPrivate.replace('{USER}', evt.d.user.id)
	});

});
bot.on('message', function (user, userID, channelID, message, evt) {
	try {

		//deny commands in DMs
		if (!bot.servers[evt.d.guild_id] && message.split(' ')[0] == '>help') {
			var helpdochere = strdoc.help.main
			if (message.split(' ')[1] && strdoc.help[message.split(' ')[1]]) { helpdochere = strdoc.help[message.split(' ')[1]] }
			bot.sendMessage({
				to: userID,
				message: helpdochere
			});
			return
		} else if (!bot.servers[evt.d.guild_id]) { return }

		//set the configuration obj (oh my lord we should asap transfer to sql or literally anything other than a json file)
		var _cfg = cfg;
		if (db.JSON().config[evt.d.guild_id]) { _cfg = db.JSON().config[evt.d.guild_id] } else {
			(function () {
				var dbc = db.JSON();
				dbc.config[evt.d.guild_id] = cfg
				dbc.config[evt.d.guild_id].guild_id = evt.d.guild_id
				db.JSON(dbc);
				db.sync();

			})();
		}

		//if the user is a bot, stop ALL of this stuff
		if (evt.d.author.bot) return
		//antispam section
		if (_cfg.enabledFeatures.antispam) {
			antiSpam.update(evt, _cfg);

			var userSpamStatus = antiSpam.getUserState(evt);
			if (userSpamStatus.tomute) {
				bot.sendMessage({
					to: channelID,
					message: 'You have been auto-detected as spamming! Please wait ' + (_cfg.spam_time_mins) + ' minutes in order to be able to type again.'
				});

				var roleIdToMuteWith = roleSearchByName(evt, 'Criminal');
				bot.addToRole({
					serverID: evt.d.guild_id,
					userID: evt.d.author.id,
					roleID: roleIdToMuteWith
				});
				antiSpam.muted(evt.d.guild_id, evt.d.author.id);
				//then, after half an hour, remove the role & unwarn them
				setTimeout(function () {
					bot.removeFromRole({
						serverID: evt.d.guild_id,
						userID: evt.d.author.id,
						roleID: roleIdToMuteWith
					});
					antiSpam.unmuted(evt.d.guild_id, evt.d.author.id);
				}, _cfg.spam_time_mins * 60000);

			} else if (userSpamStatus.towarn) {
				bot.sendMessage({
					to: channelID,
					message: ':warning: You\'re about to be marked for spam; please hold off on the pinging or you\'ll be muted for ' + (_cfg.spam_time_mins) + ' minutes. Thank you!'
				});
				antiSpam.warned(evt.d.guild_id, evt.d.author.id);
			}
		}
		//auto-ordering channels
		if(_cfg.enabledFeatures.autoorder && _cfg.autoorder_category_name) {
			console.log('orderable');
			channelActivity.updateData(evt);
			console.log(channelActivity.getLastReorderTime(evt.d.guild_id));
			if(channelActivity.getLastReorderTime(evt.d.guild_id) < Date.now() /*- 3600000*/ ) {
				console.log('ordering time');
				var categoryId = channelSearchByName(evt, _cfg.autoorder_category_name);
				if(categoryId) {
					console.log('ordering ', categoryId);
				  channelActivity.orderChannels(evt.d.guild_id, categoryId);
				}
			}
		}
		//exp management section
		if (_cfg.enabledFeatures.experience) {
			//add a random number between 10 and 25 to the score
			if (message.substring(0, 1) != cmdprefix) {
				try {
					webserver.send({ cmd: evt, serverDat: bot.servers[evt.d.guild_id] });
				} catch (e) { console.log(e) }
			}
		}

		//user commands
		if (message.substring(0, 1) == cmdprefix) {

			var args = message.substring(1).split(' ');
			var cmd = args[0].toLowerCase();
			args = args.splice(1);

			//find the command; if it exists, run it
			if (commandManager[cmd]) {
				commandManager[cmd](evt, args, _cfg, bot);
			} else {
				if (_cfg.commonSynonyms[cmd.toLowerCase()]) { var dym = " Do you mean `>" + _cfg.commonSynonyms[cmd] + '`?'; } else { var dym; }
				bot.sendMessage({
					to: channelID,
					message: "Sorry, I couldn't find a command named `" + cmd + '`.' + (dym || ' Try using `>help` to get a list of commands :smiley:')
				});
			}

			return true
		}
		//automatic response
		if (_cfg.enabledFeatures.autoresponse && _cfg.autoResp) {

			for (var i = 0, e = Object.keys(_cfg.autoResp); i < e.length; i++) {
				if (message.match(RegExp(e[i]))) {
					bot.sendMessage({
						to: channelID,
						message: _cfg.autoResp[e[i]],
					});
					break
				}
			}
		}
	}
	catch (err) {
		console.error(err);
		bot.sendMessage({
			to: "297151429087592449",
			message: 'ERROR, FRIEND:\n```' + err.toString() + '``` on line `' + err.lineNumber + '`and the message object was ```' + JSON.stringify(evt.d) + '```'
		});

	}
});

function roleSearchByName(evt, q) {
	if (!bot.servers[evt.d.guild_id]) { return null }
	var r = (Object.keys(bot.servers[evt.d.guild_id].roles).find(function (key) {
		var res = bot.servers[evt.d.guild_id].roles[key].name;
		if (res.toLowerCase() == q.toLowerCase()) { return true } else { }
	}));
	if (r != null) { return r } else { return null }
}
function channelSearchByName(evt, q) {
	if (!bot.servers[evt.d.guild_id]) { return null }
	var r = (Object.keys(bot.servers[evt.d.guild_id].channels).find(function (key) {
		var res = bot.servers[evt.d.guild_id].channels[key].name;
		if (res.toLowerCase() == q.toLowerCase()) { return true } else { }
	}));
	if (r != null) { return r } else { return null }
}

process.on('SIGTERM', function () { webserver.kill() });
