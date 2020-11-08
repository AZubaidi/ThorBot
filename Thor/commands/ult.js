module.exports = {
	name: 'ult',
	description: 'Thor ult a user with @ (kick them with a thor ult, provided they dont have actives)',
	usage: '!ult <@user> (if no user specified, ult everyone)',
	guildOnly: true,
	cooldown:10,
	async execute(message, args) {
		const timeBeforeKick = 10;
		const targetMembers = Array();
		const ultedMembers = Array();
		const executeChannel = message.member.voice.channel;
		let connection = null;
		// get the voice channel that the user who sent the command is connected in
		if (executeChannel) {
			connection = await executeChannel.join();
		} else {
			message.channel.send('cant thor ult if u aint even in a voice channel pussy <@' + message.author + '>');
			return;
		}

		/* if (message.author === '267865022540152833') {
			message.channel.send('no');
			connection.disconnect();
			return;
			// uncomment this to have custom action in specific user call
		} */

		if (!args.length) {

			for (const [memberID, member] of executeChannel.members) {
				if (memberID != '716323878846332968') {
					targetMembers.push(memberID);
				}
			}
		} else {
			message.mentions.users.map(user => {
				if (user.id != '716323878846332968') {
					targetMembers.push(user.id);
				}
			});
		}

		const dispatcher = connection.play('./assets/thor_ult.mp3');
		message.channel.send('I\'ll attack!');

		dispatcher.on('start', () => {
			console.log('thor_ult.mp3 is now playing!');
		});

		dispatcher.on('finish', () => {
			console.log('thor_ult.mp3 has finished playing!');
			connection.disconnect();
		});

		dispatcher.on('error', console.error);

		const filter = m => (m.content.toLowerCase().includes('beads') || m.content.toLowerCase().includes('aegis')) && targetMembers.includes(m.author.id);
		const collector = message.channel.createMessageCollector(filter, { time: timeBeforeKick * 1000 });

		collector.on('collect', m => {
			console.log(`Collected ${m.author.id}`);
			const index = targetMembers.indexOf(m.author.id);
			if (index > -1) {
				if (m.author.id === '717919919643164772') {
					message.channel.send('<@' + m.author + '> ' + ' not you pussy');
				} else {
					targetMembers.splice(index, 1);
					message.channel.send('<@' + m.author + '> ' + m.content.toLowerCase() + ' down');
				}
			}
		});

		//  put kick logic here
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} actives`);
			console.log('starting ult on: ');
			console.log(targetMembers);

			for (const [memberID, member] of executeChannel.members) {
				for (let i = 0; i < targetMembers.length; i++) {
					if (targetMembers[i] === memberID) {
						ultedMembers.push(memberID);
						member.voice.kick()
							.then(() => console.log(`ulted ${member.user.tag}.`))
							.catch(console.error);
					}
				}
			}
			let byeMessage = 'yea save ur beads for next game retard ';
			let byeMessageConcated = false;
			for (let i = 0; i < ultedMembers.length; i++) {
				byeMessage = byeMessage + '<@' + ultedMembers[i] + '> ';
				byeMessageConcated = true;
			}
			if (byeMessageConcated) {
				message.channel.send(byeMessage);
			}
		});
	},
};