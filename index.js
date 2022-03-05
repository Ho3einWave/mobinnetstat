const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const axios = require('axios').default;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const utils = require('./utils')

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
    TOTAL_VALUME

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', async() => {
    const channel = client.channels.cache.get(CHANNEL_ID)

    data = await utils.login(USERNAME, PASSWORD, BASE_URL)
    COOKIES = data.cookie
    LOCATION = data.location
    SERVICEID = data.serviceid

    setInterval(async() => {
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
        console.log(NAME,
            SUBID,
            TIME_LEFT,
            TOTAL_TIME,
            START_TIME,
            END_TIME,
            REMAINING_VOLUME,
            TOTAL_VALUME);
        const embed = new MessageEmbed()
            .addFields({ name: 'نام مشترک', value: `${NAME}`, inline: true }, { name: 'شناسه مشترک', value: `${SUBID}`, inline: true }, { name: 'زمان باقی مانده', value: `${TIME_LEFT} ${TOTAL_TIME}`, inline: true }, { name: 'شروع دوره', value: `${START_TIME}`, inline: true }, { name: 'پایان دوره', value: `${END_TIME}`, inline: true }, { name: 'حجم باقی مانده', value: `${REMAINING_VOLUME} ${TOTAL_VALUME}`, inline: true }, )
        channel.send({ embeds: [embed] })

    }, 1000 * 5)



});




client.login(TOKEN);