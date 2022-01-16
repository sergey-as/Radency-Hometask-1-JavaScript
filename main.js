const Categories = {
    IDEA: 'Idea',
    QUOTE: 'Quote',
    RANDOM_THOUGHT: 'Random Thought',
    TASK: 'Task'
};

const Fields = {
    id: 'id',
    name: 'Name',
    dateOfCreation: 'Created',
    category: 'Category',
    content: 'Content',
    dates: 'Dates',
    active: 'Active'
};

const columns = Object.keys(Fields).filter(fld => (fld !== 'active'));
const summaryColumns = ['Category', 'Active', 'Inactive'];

let editingTableRow;

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

function parseDates(str) {
    const dates = [];
    const arrFromStr = str.split(' ');
    for (const currentStr of arrFromStr) {
        if (+currentStr + '' !== currentStr) {
            const currentDate = Date.parse(currentStr);

            (!isNaN(currentDate)) && dates.push(new Date(currentDate));
        }
    }
    return dates;
}

class Note {
    constructor(id, name, dateOfCreation = '', category, content) {
        id ? (this.id = '' + id) : (this.id = uid());
        this.name = name;
        dateOfCreation ? (this.dateOfCreation = dateOfCreation) : (this.dateOfCreation = new Date());
        this.category = category;
        this.content = content;
        this.dates = parseDates(content);
        this.active = true;
    };
}

let notes = [
    new Note(1, 'Shopping list', new Date('2021-04-20'), Categories.TASK,
        'Tomatoes, bread'),
    new Note(2, 'The theory of evolution', new Date('2021-04-27'), Categories.RANDOM_THOUGHT,
        'The evolution is ...'),
    new Note(3, 'New Feature', new Date('2021-05-05'), Categories.IDEA,
        'Implement new feature'),
    new Note(4, 'William Gaddis', new Date('2021-05-07'), Categories.QUOTE,
        'Power doesn\'t co...'),
    new Note(5, 'Books', new Date('2021-05-15'), Categories.TASK,
        'The Learn Startup 2021-05-03 asd 2021-05-05'),
    new Note(6, 'Internship', '', Categories.TASK,
        'Complete task 1'),
    new Note(7, 'Dentist', new Date('2021-05-15'), Categories.TASK,
        'I’m gonna have a dentist appointment on the 3/5/2021, I moved it from 5/5/2021')
];
notes[6].active = false;

function createElem(tagName, parent, idName = '', className = '', innerTxt = '', name = '') {
    let elem = document.createElement(tagName);
    !(idName === '') && (elem.id = idName);
    !(className === '') && (elem.className = className);
    !(innerTxt === '') && (elem.innerText = innerTxt);
    !(name === '') && (elem.name = name);
    parent.appendChild(elem);
    return elem;
}

function deleteElem(id, tabBodyTr) {
    tabBodyTr.parentNode.removeChild(tabBodyTr);
    notes = notes.filter(note => note.id !== id);
    clearAndHideForm();
    createTableSummary();
}

function actElem(id, tabBodyTr = '') {
    (tabBodyTr !== '') && (tabBodyTr.parentNode.removeChild(tabBodyTr));

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (note.id === id) {
            note.active = !note.active;

            let idName = note.active ? 'activeNotes' : 'inactiveNotes';
            let tabBody = document.getElementById(idName + '_tabBody');
            let tabBodyTr = createElem('tr', tabBody);
            createTabBodyTr(columns, note, tabBodyTr, idName);
        }
    }

    clearAndHideForm();
    createTableSummary();
}

function create(note, tabBodyTr = null) {
    editingTableRow = tabBodyTr;

    let form = document.forms[0];
    form.hidden = false;

    (note.id) && (form.id.value = note.id);
    (!note.id) && (form.id.value = uid());

    (note.name) && (form.noteName.value = note.name);
    (!note.name) && (form.noteName.value = '');

    (note.category) && (form.category.value = note.category);

    (note.content) && (form.content.value = note.content);
    (!note.content) && (form.content.value = '');
}

function clearAndHideForm() {
    editingTableRow = null;

    let form = document.forms[0];
    form.hidden = true;

    form.id.value = '';
    form.noteName.value = '';
    form.content.value = '';
}

function editElem(id, tabBodyTr) {
    let notesById = notes.filter(note => note.id === id);
    create(notesById[0], tabBodyTr);
}

function saveElem(form) {
    let isNew = true;

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (note.id === form.id.value) {
            isNew = false;

            note.name = form.noteName.value;
            note.category = form.category.value;
            note.content = form.content.value;
            note.dates = parseDates(note.content);

            while (editingTableRow.firstChild) {
                editingTableRow.firstChild.remove();
            }
            createTabBodyTr(columns, note, editingTableRow, (note.active) ? 'activeNotes' : 'inactiveNotes');
            break;
        }
    }
    if (isNew) {
        notes.push(new Note(
            form.id.value,
            form.noteName.value,
            '',
            form.category.value,
            form.content.value
        ));

        const note = notes[notes.length - 1];
        note.active = false;
        actElem(note.id);
    }

    clearAndHideForm();
    createTableSummary();
}

function createForm(parent, idName) {
    let form = createElem('form', parent, idName, '', '', idName);
    form.style.background = 'silver';

    let pId = createElem('p', form);
    let labelId = createElem('label', pId, '', '', 'id:');
    let inputId = createElem('input', labelId, 'inputId', '', '', 'id');
    inputId.type = 'text';
    inputId.readOnly = true;

    let pName = createElem('p', form);
    let labelName = createElem('label', pName, '', '', 'Name:');
    let inputName = createElem('input', labelName, 'inputName', '', '', 'noteName');
    inputName.type = 'text';

    let pCategory = createElem('p', form);
    let labelCategory = createElem('label', pCategory, '', '', 'Category:');
    let selectCategory = createElem('select', labelCategory, 'selectCategory', '', '', 'category');
    for (const categoriesKey in Categories) {
        let currentCategory = createElem('option', selectCategory, '', '', Categories[categoriesKey]);
        currentCategory.value = Categories[categoriesKey];
    }

    let pContent = createElem('p', form);
    let labelContent = createElem('label', pContent, '', '', 'Content:');
    let inputContent = createElem('input', labelContent, 'inputContent', '', '', 'content');
    inputContent.type = 'text';

    let btnSave = createElem('input', form, 'btnSave');
    btnSave.type = 'button';
    btnSave.value = 'Save';
    btnSave.onclick = () => saveElem(form);

    return form;
}

function createTabBodyTr(columns = [], dataArrElement = {}, parent, idName) {

    const {id} = dataArrElement;

    for (const column of columns) {
        createElem('td', parent, '', '', dataArrElement[column]);
    }

    let tabBodyTrEdit = createElem('td', parent);
    let btnEdit = createElem('button', tabBodyTrEdit, '', '', 'Edit');
    btnEdit.onclick = () => editElem(id, parent);

    let tabBodyTrActive = createElem('td', parent);
    const btnInnerText = (idName === 'activeNotes' ? 'Inactive' : 'Active');
    let btnAct = createElem('button', tabBodyTrActive, '', '', btnInnerText);
    btnAct.onclick = () => actElem(id, parent);

    let tabBodyTrDel = createElem('td', parent);
    let btnDel = createElem('button', tabBodyTrDel, '', '', 'Delete');
    btnDel.onclick = () => deleteElem(id, parent);
}

function createTable(columns = [], dataArr = [], parent, idName) {
    let tab = createElem('table', parent, idName);
    tab.setAttribute('border', '2');

    let tabHead = createElem('thead', tab);
    let tabHeadTr = createElem('tr', tabHead);
    tabHeadTr.style.background = '#9d9d9d';
    for (const column of columns) {
        createElem('th', tabHeadTr, '', '', Fields[column]);
    }

    let tabHeadTrEdit = createElem('th', tabHeadTr);
    createElem('button', tabHeadTrEdit, '', '', 'Edit');

    let tabHeadTrActive = createElem('th', tabHeadTr);
    const btnInnerText = (idName === 'activeNotes' ? 'Inactive' : 'Active');

    createElem('button', tabHeadTrActive, '', '', btnInnerText);
    let tabHeadTrDel = createElem('th', tabHeadTr);
    createElem('button', tabHeadTrDel, '', '', 'Delete');

    let tabBody = createElem('tbody', tab, idName + '_tabBody');
    for (let i = 0; i < dataArr.length; i++) {
        const dataArrElement = dataArr[i];
        let tabBodyTr = createElem('tr', tabBody);
        createTabBodyTr(columns, dataArrElement, tabBodyTr, idName)
    }
    return tab;
}

function createTableSummary() {
    let summaryWrapper = document.getElementById('summaryWrapper');

    while (summaryWrapper.firstChild) {
        summaryWrapper.firstChild.remove();
    }

    let tab = createElem('table', summaryWrapper, 'summary');
    tab.setAttribute('border', '2');

    let tabHead = createElem('thead', tab);
    let tabHeadTr = createElem('tr', tabHead);
    tabHeadTr.style.background = '#9d9d9d';

    for (const column of summaryColumns) {
        createElem('th', tabHeadTr, '', '', column);
    }

    let tabBody = createElem('tbody', tab, 'summary_tabBody');

    const summaryObj = {
        [Categories.IDEA]: [0, 0],
        [Categories.QUOTE]: [0, 0],
        [Categories.RANDOM_THOUGHT]: [0, 0],
        [Categories.TASK]: [0, 0]
    };

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const ind = note.active ? 0 : 1;
        summaryObj[note.category][ind]++;
    }

    for (const summaryObjKey in summaryObj) {
        let tabBodyTr = createElem('tr', tabBody);
        createElem('td', tabBodyTr, '', '', summaryObjKey);
        createElem('td', tabBodyTr, '', '', summaryObj[summaryObjKey][0]);
        createElem('td', tabBodyTr, '', '', summaryObj[summaryObjKey][1]);
    }

    return tab;
}

function refresh() {
    let mainDiv = document.getElementById('mainDiv');
    mainDiv.parentNode.removeChild(mainDiv);
    mainDiv = createElem('div', document.body, 'mainDiv');

    createElem('hr', mainDiv);
    let activeNotesWrapper = createElem('div', mainDiv, '', '', 'Active Notes');
    let activeNotes = notes.filter(note => note.active);
    createTable(columns, activeNotes, activeNotesWrapper, 'activeNotes');

    createElem('hr', mainDiv);
    let btnCreate = createElem('button', mainDiv, '', '', 'Create Note');
    btnCreate.onclick = () => create({});

    let form = createForm(mainDiv, 'createEditForm');
    form.hidden = true;

    createElem('hr', mainDiv);
    let inactiveNotesWrapper = createElem('div', mainDiv, '', '', 'Inactive Notes');
    let inactiveNotes = notes.filter(note => !note.active);
    createTable(columns, inactiveNotes, inactiveNotesWrapper, 'inactiveNotes');

    createElem('hr', mainDiv);
    createElem('div', mainDiv, 'summaryWrapper', '', 'Summary');
    createTableSummary();
}

let btnRefresh = createElem('button', document.body, '', '', 'Refresh');
btnRefresh.onclick = () => refresh();

createElem('div', document.body, 'mainDiv');

refresh();
