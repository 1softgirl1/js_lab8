document.addEventListener('DOMContentLoaded', async () => {
    const nameElement = document.getElementById('name');
    const refreshButton = document.getElementById('refresh');
    const nextButton = document.getElementById('next');
    const welcomeText = document.getElementById('welcomeText');

    const catsBtn = document.getElementById('cats');
    const dogsBtn = document.getElementById('dogs');
    const foxesBtn = document.getElementById('foxes');
    const animalImg = document.getElementById('animal_img');
    const factElement = document.getElementById('fact');
    const updBtn = document.getElementById('upd_btn');

    let currentAnimal = '';

    async function getName() {
        const url = `https://api.randomdatatools.ru/?count=1&&params=LastName,FirstName`;

        try {
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const apiUrl = 'https://api.randomdatatools.ru/?count=1&params=LastName,FirstName';

            const response = await fetch(proxyUrl + apiUrl, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке имени');
            }
            const data = await response.json();

            nameElement.textContent = data.LastName + ' ' + data.FirstName;

        } catch (error) {
            nameElement.textContent = error.message;
        }
    }

    async function resetName() {
        nameElement.textContent = '...';
        await getName();
    }

    async function translateText(text, targetLang = 'ru') {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
            const data = await response.json();
            return data.responseData.translatedText || text;
        } catch (error) {
            console.error('Ошибка перевода:', error);
            return text;
        }
    }

    async function getAnimalFact(animal) {
        try {
            currentAnimal = animal;
            let fact = '';

            if (animal === 'dog') {
                const response = await fetch('https://dog.ceo/api/breeds/image/random');
                const data = await response.json();
                animalImg.src = data.message;

                const factResponse = await fetch('https://some-random-api.ml/animal/dog');
                const factData = await factResponse.json();
                fact = await translateText(factData.fact);
            }
            else if (animal === 'cat') {
                const response = await fetch('https://api.thecatapi.com/v1/images/search');
                const data = await response.json();
                animalImg.src = data[0].url;

                const factResponse = await fetch('https://some-random-api.ml/animal/cat');
                const factData = await factResponse.json();
                fact = await translateText(factData.fact);
            }
            else if (animal === 'fox') {
                const apiUrl = "https://randomfox.ca/floof/";

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        animalImg.src = data.image;
                    })
                    .catch(error => console.error(error));

                const factResponse = await fetch('https://some-random-api.ml/animal/fox');
                const factData = await factResponse.json();
                fact = await translateText(factData.fact);
            }

            factElement.textContent = fact || 'Интересный факт не найден';

            document.getElementById('choose_side').style.display = 'none';
            document.getElementById('random_fact').style.display = 'block';

        } catch (error) {
            console.error('Ошибка:', error);
            factElement.textContent = 'Ошибка загрузки данных. Попробуйте ещё раз.';
        }
    }

    await getName();

    refreshButton.addEventListener('click', resetName);
    nextButton.addEventListener('click', function(){
        document.getElementById('rand_name').style.display = 'none';
        document.getElementById('choose_side').style.display = 'block';
    });

    catsBtn.addEventListener('click', () => getAnimalFact('cat'));
    dogsBtn.addEventListener('click', () => getAnimalFact('dog'));
    foxesBtn.addEventListener('click', () => getAnimalFact('fox'));


    updBtn.addEventListener('click', () => {
        if (currentAnimal) {
            getAnimalFact(currentAnimal);
        }
    });

});