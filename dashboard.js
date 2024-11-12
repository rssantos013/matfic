const getTokenFromQuery = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('token')
}

const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token)
}

const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token')
}

const getMatificDataFromLocalStorage = () => {
    return localStorage.getItem('matificData')
}

const removeMatificDataFromLocalStorage = () => {
    localStorage.removeItem('matificData')
}

const greetUser = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]))
    document.getElementById('username').innerText = payload.username
    document.getElementById('profilePicture').src = `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.png`
}

const displayAssignments = (data) => {
    const assignmentsDiv = document.getElementById('assignments')
    assignmentsDiv.innerHTML = ''

    // const mainTitle = document.createElement('div')
    // mainTitle.className = 'assignment-title'
    // mainTitle.innerText = data.assignment
    // assignmentsDiv.appendChild(mainTitle)

    const lessonBox = document.createElement('div')
    lessonBox.className = 'lesson-box'
    lessonBox.setAttribute('data-id', data.id)

    const lessonTitle = document.createElement('div')
    lessonTitle.className = 'lesson-title'
    lessonTitle.innerText = data.assignment
    lessonBox.appendChild(lessonTitle)

    const dropdown = document.createElement('div')
    dropdown.className = 'dropdown'

    const autoAnswerButton = document.createElement('button')
    autoAnswerButton.innerText = 'Auto Resposta'
    autoAnswerButton.addEventListener('click', async () => {
        // disable buttons
        autoAnswerButton.disabled = true

        const notificationProgress = document.createElement('div')
        notificationProgress.className = 'notification yellow'
        notificationProgress.innerText = 'em andamento...'
        lessonBox.appendChild(notificationProgress)
        notificationProgress.style.display = 'block'

        const autoAnswerResponse = await fetch("/api/matific-complete", {
                method: 'POST',
                headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en',
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'sec-gpc': '1',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'omit'
        })

        notificationProgress.style.display = 'none'

        if (autoAnswerResponse.ok) {
            const notification = document.createElement('div')
            notification.className = 'notification'
            notification.innerText = 'concluído com sucesso! atualize o Matific para ver a lição concluída'
            lessonBox.appendChild(notification)
            notification.style.display = 'block'
        } else {
            const notification = document.createElement('div')
            notification.className = 'notification red'
            notification.innerText = 'Falha na resposta automática'
            lessonBox.appendChild(notification)
            notification.style.display = 'block'
        }
    })
    dropdown.appendChild(autoAnswerButton)

    lessonBox.appendChild(dropdown)

    assignmentsDiv.appendChild(lessonBox)

    autoAnswerButton.disabled = false
}
const token = getTokenFromQuery()
if (token) {
    saveTokenToLocalStorage(token)
}

const storedToken = getTokenFromLocalStorage()
if (!storedToken) {
    window.location.href = 'index.html'
} else {
    greetUser(storedToken)
}

const matificData = getMatificDataFromLocalStorage()
if (matificData) {
    console.log('Matific data:', matificData)
    document.getElementsByClassName('bookmark-container')[0].style.display = 'none'
    window.matificData = JSON.parse(JSON.parse(atob(matificData)).thing)
    removeMatificDataFromLocalStorage()
    displayAssignments(window.matificData)
}

document.getElementById('profileButton').addEventListener('click', function() {
    const logoutButton = document.getElementById('logoutButton')
    logoutButton.style.display = logoutButton.style.display === 'none' || logoutButton.style.display === '' ? 'block' : 'none'
})

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token')
    window.location.href = 'index.html'
})