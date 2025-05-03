const proxy = "https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://api.randomdatatools.ru/";

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getData() {
    try {
        const n = getRandomIntInclusive(5, 20);
        const queryParams = `?count=${n}&fields=FirstName,LastName,YearsOld,Gender,Address,Phone`;
        const response = await fetch(`${proxy}${apiUrl}${queryParams}`);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        return data.map(item => ({
            firstName: item.FirstName,
            lastName: item.LastName,
            age: item.YearsOld,
            gender: item.Gender,
            address: item.Address,
            phone: item.Phone,
        }));
    } catch (error) {
        throw new Error("Ошибка при получении данных: " + error.message);
    }
}