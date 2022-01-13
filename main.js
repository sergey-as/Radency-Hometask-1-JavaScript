const Categories = {
    IDEA: 'Idea',
    RANDOM_THOUGHT: 'Random Thought',
    TASK: 'Task',
    QUOTE: 'Quote'
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

const uid = function () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

class Note {
    constructor(id, name, dateOfCreation, category, content, dates = []) {
        if (id) {
            this.id = id;
        } else (this.id = uid());

        this.name = name;

        if (dateOfCreation) {
            this.dateOfCreation = dateOfCreation;
        } else (this.dateOfCreation = new Date());

        this.category = category;
        this.content = content;
        this.dates = dates;
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
        'The Learn Startup',
        [new Date('2021-05-03'), new Date('2021-05-05')]),
    new Note(6, 'Internship', '', Categories.TASK,
        'Complete task 1'),
    new Note(7, 'Dentist', new Date('2021-05-15'), Categories.TASK,
        'I’m gonna have a dentist appointment on the 3/5/2021, I moved it from 5/5/2021',
        [new Date('2021-05-03'), new Date('2021-05-05')]),
];

notes[6].active = false;

function createElem(tagName, parent, idName = '', className = '', innerTxt = '') {
    let elem = document.createElement(tagName);
    !(idName === '') && (elem.id = idName);
    !(className === '') && (elem.className = className);
    !(innerTxt === '') && (elem.innerText = innerTxt);
    parent.appendChild(elem);
    return elem;
}

function deleteElem(id, tabBodyTr) {
    tabBodyTr.parentNode.removeChild(tabBodyTr);
    notes = notes.filter(note => note.id !== id);
}

function actElem(id, tabBodyTr) {
    tabBodyTr.parentNode.removeChild(tabBodyTr);
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (note.id === id) {
            note.active = !note.active;

            let idName = note.active ? 'activeNotes' : 'inactiveNotes';
            let tabBody = document.getElementById(idName + '_tabBody');
            createTabBodyTr(columns, note, tabBody, idName);
        }
    }
}

function editElem(id, tabBodyTr) {

}

function createTabBodyTr(columns = [], dataArrElement = {}, parent, idName) {

    const {id} = dataArrElement;

    let tabBodyTr = createElem('tr', parent);
    for (const column of columns) {
        createElem('td', tabBodyTr, '', '', dataArrElement[column]);
    }

    let tabBodyTrEdit = createElem('td', tabBodyTr);
    let btnEdit = createElem('button', tabBodyTrEdit, '', '', 'Edit');
    btnEdit.onclick = () => editElem(id, tabBodyTr);

    let tabBodyTrActive = createElem('td', tabBodyTr);
    const btnInnerText = (idName === 'activeNotes' ? 'Inactive' : 'Active');
    let btnAct = createElem('button', tabBodyTrActive, '', '', btnInnerText);
    btnAct.onclick = () => actElem(id, tabBodyTr);

    let tabBodyTrDel = createElem('td', tabBodyTr);
    let btnDel = createElem('button', tabBodyTrDel, '', '', 'Delete');
    btnDel.onclick = () => deleteElem(id, tabBodyTr);
}

function createTable(columns = [], dataArr = [], parent, idName) {
    let tab = createElem('table', parent, idName);
    tab.setAttribute('border', '2');

    let tabHead = createElem('thead', tab);
    let tabHeadTr = createElem('tr', tabHead);
    tabHeadTr.style.background = '#9d9d9d';
    for (const column of columns) {
        // let tabHeadTh = createElem('th', tabHeadTr, '', '', column);
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
        createTabBodyTr(columns, dataArrElement, tabBody, idName)
    }
    return tab;
}

function refresh() {
    let mainDiv = document.getElementById('mainDiv');
    mainDiv.parentNode.removeChild(mainDiv);
    mainDiv = createElem('div', document.body, 'mainDiv');

    let activeNotesWrapper = createElem('div', mainDiv, '', '', 'Active Notes');
    let activeNotes = notes.filter(note => note.active);
    createTable(columns, activeNotes, activeNotesWrapper, 'activeNotes');

    let btnCreate = createElem('button', activeNotesWrapper, '', '', 'Create Note');
    btnCreate.onclick = () => {
        {
        }
    }

    let inactiveNotesWrapper = createElem('div', mainDiv, '', '', 'Inactive Notes');
    let inactiveNotes = notes.filter(note => !note.active);
    createTable(columns, inactiveNotes, inactiveNotesWrapper, 'inactiveNotes');
}

let btnRefresh = createElem('button', document.body, '', '', 'Refresh');
btnRefresh.onclick = () => refresh();

createElem('div', document.body, 'mainDiv');

refresh();
