function dateToDays(dateString) {
    const date = new Date(dateString)
    return Math.ceil((date - Date.now()) / (1000 * 60 * 60 * 24))
}

async function getCounters() {
    const response = await fetch('/get')
    const jsonResponse = await response.json()
    const data = JSON.parse(jsonResponse.data)

    let ans = ''

    for (let entry of data) {
        // setting the title
        let numDays = dateToDays(entry.date)
        let isAlive = numDays > 0
        let cardTitle = isAlive ? `${numDays} ${numDays == 1 ? "day" : "days"} until ${entry.city.trim()}` : `${entry.city.trim()} at ${entry.date.trim()}`

        ans += `
        <div class="col col-md-4 counter ${isAlive ? "alive" : "expired"}">
            <div class="card mb-3">
                <img src="${entry.src||"https://miro.medium.com/max/1663/1*_6EdJgpcWyeWne36eFH7eA@2x.jpeg"}" class="card-img-top" >
                <div class="card-body">
                    <h5 class="card-title">${cardTitle}</h5>
                    <p class="card-text"></p>
                    <p class="card-text"><small class="text-muted">Photo by ${entry.usr||"¯\\_(ツ)_/¯"} on Unsplash</small></p>
                </div>
            </div>
        </div>
        `
    }

    document.querySelector('#output').innerHTML = ans
}

async function setCounter(event) {
    event.preventDefault()

    const response = await fetch('/set', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'POST',
        body: JSON.stringify({
            city: event.target.city.value,
            date: event.target.date.value,
        })
    })

    if (response.status == 201) {
        event.target.reset()
        document.querySelector('#close').click()
        getCounters()
    } else {
        alert('Something went wrong. Please try again later.')
    }
}

window.onload = function() {
    // form 
    document.querySelector('#form').onsubmit = setCounter

    // radio button filter
    const counters = document.getElementsByClassName('counter')

    for (let button of document.getElementsByName('options')) {
        button.onchange = event => {
            for (let counter of counters) {counter.style.display = 'none'}
            for (let counter of document.getElementsByClassName(event.target.value)) {
                counter.style.display = 'block'
            }
        }
    }

    // fetch counters
    getCounters()
}
