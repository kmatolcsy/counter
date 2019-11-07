window.onload = function() {
    // GET request
    const update = () => {
        fetch('/get')
        .then(response => response.json())
        .then(jsonResponse => {
            const output = document.querySelector('#output')
            let ans = ''
            let data = JSON.parse(jsonResponse.data)

            for (entry of data) {
                ans += `
                <div class="col col-md-4">
                    <div class="card mb-3">
                        <img src="https://www.spain.info/export/sites/spaininfo/comun/carrusel-recursos/andalucia/malaga-26926024-istock.jpg_369272544.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${entry.city.trim()} at ${entry.date.trim()}</h5>
                            <p class="card-text"></p>
                            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
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
