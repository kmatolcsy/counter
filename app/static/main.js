function dateToDays(dateString) {
    const date = new Date(dateString)
    return Math.ceil((date - Date.now()) / (1000 * 60 * 60 * 24))
}


async function getCounters() {
    const response = await fetch('/get')
    const jsonResponse = await response.json()
    const data = JSON.parse(jsonResponse.data)

    let ans = ''

    for (let [idx, entry] of data.entries()) {
        // setting the title
        let numDays = dateToDays(entry.date)
        let isAlive = numDays > 0
        let cardTitle = isAlive ? `${numDays} ${numDays == 1 ? "day" : "days"} until ${entry.city.trim()}` : `${entry.city.trim()} at ${entry.date.trim()}`
        console.log(entry)
        console.log(entry._id["$oid"])
        ans += `
        <div class="col col-md-4 counter ${isAlive ? "alive" : "expired"}" id="${entry._id["$oid"]}">
            <div class="delete">
                <center><i class="cross fas fa-plus"></i></center>
            </div>
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


function deleteCounter(event) {
    const key = event.currentTarget.parentElement.id
    
    document.getElementById('confirm').onclick = async function() {
        await fetch('/del', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'DELETE',
            body: JSON.stringify({"_id": key})
        })
        getCounters()
        $('#deleteModal').modal('hide')
    }

    $('#deleteModal').modal('show')
}


function enableDelete(event) {
    const counters = document.getElementsByClassName('counter')

    for (let counter of counters) {
        counter.children[0].style.display = event.target.checked ? 'block' : 'none'
        counter.style.animation = event.target.checked ? "wiggle 0.3s infinite" : "none"

        if (!event.target.checked) {counter.style.transform = "rotate(0deg)"}
    }
}


 async function main() {
    // form add 
    document.querySelector('#form').onsubmit = setCounter

    // enable delete buttons
    document.getElementById('delete').onchange = enableDelete

    // radio button filter
    for (let button of document.getElementsByName('options')) {
        button.onchange = event => {
            const counters = document.getElementsByClassName('counter')
            for (let counter of counters) {counter.style.display = 'none'}
            for (let counter of document.getElementsByClassName(event.target.value)) {
                counter.style.display = 'block'
            }
        }
    }

    // fetch counters
    await getCounters()

    // delete buttons
    for (button of document.getElementsByClassName('delete')) {
        button.onclick = deleteCounter
    }
}

document.addEventListener('DOMContentLoaded', main)
