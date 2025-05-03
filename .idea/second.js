const apiUrls = [
    "https://api.artic.edu/api/v1/artworks/129884", // Информация по определенному произведению искусства
    "https://emojihub.yurace.pro/api/random", // Рандомные эмодзи
    "https://openlibrary.org/search.json?q=the+lord+of+the+rings", // Информация о книге "Властелин колец"
    "https://api.country.is/", // Страна по ip
    "https://yesno.wtf/api" // Рандомное ДА или НЕТ
];

function makeXhrRequest(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(new Error(`Request failed with status ${xhr.status}`), null);
        }
    };
    xhr.onerror = function() {
        callback(new Error("Request failed"), null);
    };
    xhr.send();
}

function makeSequentialRequests() {
    let index = 0;

    function next() {
        if (index >= apiUrls.length) return;

        const url = apiUrls[index++];
        makeXhrRequest(url, function(error, data) {
            if (error) {
                console.error(`Error fetching ${url}:`, error);
            } else {
                console.log(`Response from ${url}:`, data);
            }
            next();
        });
    }

    next();
}

makeSequentialRequests();


function request(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(new Error(`Request failed with status ${xhr.status}`), null);
        }
    };
    xhr.onerror = function() {
        callback(new Error("Request failed"), null);
    };
    xhr.send();
}


request(apiUrls[0], (err, data) => {
    if (err) return console.error(err);
    console.log(data);
    request(apiUrls[1], (err, data) => {
        if (err) return console.error(err);
        console.log(data);
        request(apiUrls[2], (err, data) => {
            if (err) return console.error(err);
            console.log(data);
            request(apiUrls[3], (err, data) => {
                if (err) return console.error(err);
                console.log(data);
                request(apiUrls[4], (err, data) => {
                    if (err) return console.error(err);
                    console.log(data);
                });
            });
        });
    });
});


function requestPromise(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

requestPromise(apiUrls[0])
    .then(data => {
        console.log(data);
        return requestPromise(apiUrls[1]);
    })
    .then(data => {
        console.log(data);
        return requestPromise(apiUrls[2]);
    })
    .then(data => {
        console.log(data);
        return requestPromise(apiUrls[3]);
    })
    .then(data => {
        console.log(data);
        return requestPromise(apiUrls[4]);
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });


async function makeRequestsAsync() {
    try {
        const data1 = await requestPromise(apiUrls[0]);
        console.log(data1);

        const data2 = await requestPromise(apiUrls[1]);
        console.log(data2);

        const data3 = await requestPromise(apiUrls[2]);
        console.log(data3);

        const data4 = await requestPromise(apiUrls[3]);
        console.log(data4);

        const data5 = await requestPromise(apiUrls[4]);
        console.log(data5);
    } catch (err) {
        console.error(err);
    }
}

makeRequestsAsync();