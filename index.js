const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const axios = require('axios').default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const utils = require('./utils')
const fs = require('fs');


// Constants 
const BASE_URL = "https://my.mobinnet.ir"
const USERNAME = config.username
const PASSWORD = config.password
const CHANNEL_ID = config.channelid
const TOKEN = config.token


// VARS
let COOKIES,
    SERVICEID,
    LOCATION,
    NAME,
    SUBID,
    TIME_LEFT,
    TOTAL_TIME,
    START_TIME,
    END_TIME,
    REMAINING_VOLUME,
    TOTAL_VALUME,
    MESSAGE_ID

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', async() => {
    console.log(`${client.user.tag} is up and runnig!`);
    const channel = client.channels.cache.get(CHANNEL_ID)

    setInterval(async() => {
            data = await utils.login(USERNAME, PASSWORD, BASE_URL)
            COOKIES = data.cookie
            LOCATION = data.location
            SERVICEID = data.serviceid
            MESSAGE_ID = config.messageid ? config.messageid : undefined
            const stat = await axios.get(`${BASE_URL}/Dashboard/Balance?serviceId=${SERVICEID}&_=${Date.now()}`, { headers: { "Cookie": COOKIES } })
            const dom = new JSDOM(stat.data);
            NAME = dom.window.document.querySelector("#usercontent > div.dashboard-box.blue-light > p:nth-child(2)").textContent;
            SUBID = dom.window.document.querySelector("#usercontent > div.dashboard-box.blue-light > p:nth-child(4)").textContent;
            TIME_LEFT = dom.window.document.querySelector("body > div > div:nth-child(2) > div.dashboard-box.blue-light-chart > h4").textContent;
            TOTAL_TIME = dom.window.document.querySelector("body > div > div:nth-child(2) > div.dashboard-box.blue-light-chart > p:nth-child(3)").textContent;
            START_TIME = dom.window.document.querySelector("body > div > div:nth-child(2) > div.dashboard-box.blue-light-chart > p:nth-child(4)").textContent;
            END_TIME = dom.window.document.querySelector("body > div > div:nth-child(2) > div.dashboard-box.blue-light-chart > p:nth-child(5)").textContent;
            REMAINING_VOLUME = dom.window.document.querySelector("body > div > div:nth-child(3) > div.dashboard-box.grean-light-chart > div > h1").textContent;
            TOTAL_VALUME = dom.window.document.querySelector("body > div > div:nth-child(3) > div.dashboard-box.grean-light-chart > p").textContent;
            const embed = new MessageEmbed()
                .addFields({ name: 'نام مشترک', value: `${NAME}`, inline: true }, { name: 'شناسه مشترک', value: `${SUBID}`, inline: true }, { name: 'زمان باقی مانده', value: `${TIME_LEFT} ${TOTAL_TIME}`, inline: true }, { name: 'شروع دوره', value: `${START_TIME}`, inline: true }, { name: 'پایان دوره', value: `${END_TIME}`, inline: true }, { name: 'حجم باقی مانده', value: `${REMAINING_VOLUME} ${TOTAL_VALUME}`, inline: true })
                .setColor("#85c226")
                .setAuthor({ name: 'MobinNet Stat\'s', url: "https://my.mobinnet.ir", iconURL: 'https://api.daneshkar.net/file/pub-download/p7nrlZDLwq4W/view/public-logo.png' });
            if (MESSAGE_ID) {
                message = await channel.messages.fetch(MESSAGE_ID)
                message.edit({ embeds: [embed] })

            } else {
                MESSAGE_ID = await channel.send({ embeds: [embed] })
                MESSAGE_ID = MESSAGE_ID.id
                config.messageid = MESSAGE_ID
                let data = JSON.stringify(config, null, 2);
                fs.writeFile('config.json', data, (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                });
            }


        }, 1000 * 60 * 60) // Hourly Update 



});

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');

    });


client.login(TOKEN);