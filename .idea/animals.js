

fetch('https://api.randomdatatools.ru/?count=1&&params=LastName,FirstName')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => document.getElementById('name').textContent = JSON.parse(data))
    .catch(error => console.error('Error:', error));

