import { getData } from './humansData.js';

const loadBtn = document.getElementById('loadBtn');
const genderFilter = document.getElementById('genderFilter');
const tableContainer = document.getElementById('tableContainer');
let currentData = [];

loadBtn.addEventListener('click', async () => {
    try {
        currentData = await getData();
        renderTable(currentData);
        setupControls();
    } catch (error) {
        tableContainer.innerHTML = `<p class="error">Ошибка при загрузке данных: ${error.message}</p>`;
    }
});

genderFilter.addEventListener('change', () => {
    filterTable();
});

function setupControls() {
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Добавить человека';
    addBtn.classList.add('add-btn');
    addBtn.addEventListener('click', showAddForm);
    tableContainer.appendChild(addBtn);
}

function filterTable() {
    const filterValue = genderFilter.value;
    const filteredData = filterValue === 'all'
        ? currentData
        : currentData.filter(person => person.gender === filterValue);
    renderTable(filteredData);
}

function renderTable(data) {
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Имя', 'Фамилия', 'Возраст', 'Пол', 'Адрес', 'Телефон', 'Действия'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);


    const tbody = document.createElement('tbody');
    data.forEach((person, index) => {
        const row = document.createElement('tr');

        if (person.age < 18) row.classList.add('under18');
        else if (person.age < 60) row.classList.add('under60');
        else row.classList.add('over60');

        ['firstName', 'lastName', 'age', 'gender', 'address', 'phone'].forEach(field => {
            const td = document.createElement('td');
            td.textContent = person[field];
            row.appendChild(td);
        });


        const actionsTd = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Изменить';
        editBtn.classList.add('action-btn', 'edit-btn');
        editBtn.addEventListener('click', () => showEditForm(person, index));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.classList.add('action-btn', 'delete-btn');
        deleteBtn.addEventListener('click', () => {
            currentData.splice(index, 1);
            filterTable();
        });

        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        row.appendChild(actionsTd);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    const addBtn = tableContainer.querySelector('.add-btn');
    tableContainer.innerHTML = '';
    if (addBtn) tableContainer.appendChild(addBtn);
    tableContainer.appendChild(table);
}

function showAddForm() {
    showPersonForm(null, -1);
}

function showEditForm(person, index) {
    showPersonForm(person, index);
}

function showPersonForm(person, index) {
    const isEdit = index >= 0;
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    const fields = [
        { name: 'firstName', label: 'Имя', type: 'text', value: person?.firstName || '' },
        { name: 'lastName', label: 'Фамилия', type: 'text', value: person?.lastName || '' },
        { name: 'age', label: 'Возраст', type: 'number', value: person?.age || '' },
        { name: 'gender', label: 'Пол', type: 'select',
            options: ['Мужской', 'Женский'], value: person?.gender || 'Мужской' },
        { name: 'address', label: 'Адрес', type: 'text', value: person?.address || '' },
        { name: 'phone', label: 'Телефон', type: 'tel', value: person?.phone || '' }
    ];

    fields.forEach(field => {
        const row = document.createElement('div');
        row.classList.add('form-row');

        const label = document.createElement('label');
        label.textContent = field.label;

        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                if (option === field.value) optionElement.selected = true;
                input.appendChild(optionElement);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.value = field.value;
        }
        input.name = field.name;

        row.appendChild(label);
        row.appendChild(input);
        formContainer.appendChild(row);
    });

    const buttonsRow = document.createElement('div');
    buttonsRow.classList.add('form-buttons');

    const submitBtn = document.createElement('button');
    submitBtn.textContent = isEdit ? 'Сохранить' : 'Добавить';
    submitBtn.classList.add('action-btn');
    submitBtn.style.backgroundColor = '#4CAF50';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Отмена';
    cancelBtn.classList.add('action-btn');
    cancelBtn.style.backgroundColor = '#f44336';

    submitBtn.addEventListener('click', () => {
        const inputs = formContainer.querySelectorAll('input, select');
        const newPerson = {};
        inputs.forEach(input => {
            newPerson[input.name] = input.type === 'number' ? parseInt(input.value) : input.value;
        });

        if (isEdit) {
            currentData[index] = newPerson;
        } else {
            currentData.push(newPerson);
        }

        formContainer.remove();
        filterTable();
    });

    cancelBtn.addEventListener('click', () => {
        formContainer.remove();
    });

    buttonsRow.appendChild(submitBtn);
    buttonsRow.appendChild(cancelBtn);
    formContainer.appendChild(buttonsRow);

    tableContainer.appendChild(formContainer);
}