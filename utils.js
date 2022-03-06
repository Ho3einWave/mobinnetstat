const axios = require('axios').default;

exports.login = async(username, password, BASE_URL) => {
    const auth = await axios.post(`${BASE_URL}/api/account/login`, { 'username': username, 'password': password, 'rememberMe': true })
    let COOKIES = auth.headers['set-cookie'][0]
    const redirect = await axios.get(`${BASE_URL}/api/account/redirect/`, { headers: { "Cookie": COOKIES } })
    let LOCATION = redirect.request.path
    let SERVICEID = LOCATION.split('/')
    SERVICEID = SERVICEID[SERVICEID.length - 1]
    console.log("Logged in into panel!");
    return { cookie: COOKIES, location: LOCATION, serviceid: SERVICEID }
}