const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token')
}

const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token)
}

    const saveMatificDataToLocalStorage = (matificData) => {
    localStorage.setItem('matificData', matificData)
}

const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token')
const matificData = urlParams.get('matificData')

if (token) {
    console.log('Saving token to localStorage:', token)
    saveTokenToLocalStorage(token)
}

if (urlParams.get('redirected')) {
    window.location.href = 'error'
}

if (matificData) {
    console.log('Saving matificData to localStorage:', matificData)
    window.matificData = matificData
    saveMatificDataToLocalStorage(matificData)
}

const storedToken = getTokenFromLocalStorage()
console.log('Stored token:', storedToken)
if (storedToken) {
    console.log('Redirecting to dashboard with token:', storedToken)
    window.location.href = `/dashboard?token=${storedToken}`
}

document.getElementById('authorizeDiscordButton').addEventListener('click', function() {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1305993713914482749&response_type=code&redirect_uri=https%3A%2F%2Fmatfic.vercel.app%2Fdashboard.js&scope=identify+guilds.join+guilds'
})
