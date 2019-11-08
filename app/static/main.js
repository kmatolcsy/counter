function dateToDays(dateString) {
    const date = new Date(dateString)
    return Math.ceil((date - Date.now()) / (1000 * 60 * 60 * 24))
}


window.onload = function() {
    // GET request
    const update = () => {
        fetch('/get')
        .then(response => response.json())
        .then(jsonResponse => {
            const output = document.querySelector('#output')
            const data = JSON.parse(jsonResponse.data)
            let ans = ''

            for (let entry of data) {
                // setting the title
                let days = dateToDays(entry.date)
                let title = days > 0 ? `${days} ${days == 1 ? "day" : "days"} until ${entry.city.trim()}` : `${entry.city.trim()} at ${entry.date.trim()}`

                ans += `
                <div class="col col-md-4">
                    <div class="card mb-3">
                        <img src="${entry.src||"https://miro.medium.com/max/1663/1*_6EdJgpcWyeWne36eFH7eA@2x.jpeg"}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text"></p>
                            <p class="card-text"><small class="text-muted">Photo by ${entry.usr||"¯\\_(ツ)_/¯"} on Unsplash</small></p>
                        </div>
                    </div>
                </div>
                `
            }

            output.innerHTML = ans
        })
    }

    // POST request
    const form = document.querySelector('#form')
    const closeButton = document.querySelector('#close')

    form.onsubmit = event => {
        event.preventDefault()

        fetch('/set', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                city: event.target.city.value,
                date: event.target.date.value,
            })
        })

        form.reset()
        closeButton.click()
        update()
    }

    update()
}
