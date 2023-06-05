// handle the form submission of add-finances and store the data to local storage
let addFinancesForm = document.getElementById('add-finances');
addFinancesForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let finances = JSON.parse(localStorage.getItem('finances')) || [];

    
    // create a finance object form the formdata
    let finance = {
        id: Math.floor(Math.random() * 100000000),
        title: addFinancesForm.title.value,
        amount: addFinancesForm.amount.value,
        date: addFinancesForm.date.value,
        type: addFinancesForm.type.value
    };
    finances.push(finance);
    localStorage.setItem('finances', JSON.stringify(finances));
    addFinancesForm.reset();
    render_finances();
}
);

function render_finances() {

// on page load get the data from local storage and display it in the table
let finances = JSON.parse(localStorage.getItem('finances')) || [];
let financesTable = document.getElementById('finances-table');
let financesTableBody = document.getElementById('finances-table-body');
// reset the table body
financesTableBody.innerHTML = '';
document.getElementById('total_income') ? document.getElementById('total_income').remove() : '';
document.getElementById('total_expense') ? document.getElementById('total_expense').remove() : '';
document.getElementById('total_balance') ? document.getElementById('total_balance').remove() : '';
let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;
for (let i = 0; i < finances.length; i++) {
    let finance = finances[i];
    let row = `<tr data_index="${finance.id}">
    <td contenteditable="true" handle_dropdown>${finance.type}</td>
                    <td contenteditable="true">${finance.title}</td>
                    <td contenteditable="true">${finance.amount}</td>
                    <td contenteditable="true">${finance.date}</td>
                    <td>
                    <button class="btn btn-danger" onclick="saveFinance(${finance.id})">Save</button>
                    <button class="btn btn-danger" onclick="deleteFinance(${finance.id})">Delete</button></td>
                </tr>`;
    financesTableBody.innerHTML += row;
    if (finance.type === 'income') {
        totalIncome += parseInt(finance.amount);
    } else {
        totalExpense += parseInt(finance.amount);
    }
}
totalBalance = totalIncome - totalExpense;

financesTable.innerHTML += `<tr id="total_income"> <td colspan="5">Total Income: ${totalIncome} </td> </tr>`;
financesTable.innerHTML += `<tr id="total_expense"> <td colspan="5">Total Expense: ${totalExpense} </td> </tr>`;
financesTable.innerHTML += `<tr id="total_balance"> <td colspan="5">Total Balance: ${totalBalance} </td> </tr>`;



// get the percentage of income and expense
let incomePercentage = (totalIncome / (totalIncome + totalExpense)) * 100;
let expensePercentage = (totalExpense / (totalIncome + totalExpense)) * 100;

// set the progress bar width according to the percentage
let incomeProgressBar = document.getElementById('incomes-progress-bar-fill');
let expenseProgressBar = document.getElementById('expenses-progress-bar-fill');
incomeProgressBar.style.width = incomePercentage + '%';
expenseProgressBar.style.width = expensePercentage + '%';

// set the progress bar text
let incomeProgressBarText = document.getElementById('incomes-progress-bar-label');
let expenseProgressBarText = document.getElementById('expenses-progress-bar-label');
incomeProgressBarText.innerHTML = incomePercentage.toFixed(2) + '%';
expenseProgressBarText.innerHTML = expensePercentage.toFixed(2) + '%';
handle_dropdown();
};

// render on first page load
render_finances();

// function to delete a finance from the table and local storage
function deleteFinance(id) {
    let finances = JSON.parse(localStorage.getItem('finances')) || [];
    let filteredFinances = finances.filter(function (finance) {
        return finance.id !== id;
    });
    localStorage.setItem('finances', JSON.stringify(filteredFinances));
    
    render_finances();
}

// function to save the edited finance
function saveFinance(id) {
    let finances = JSON.parse(localStorage.getItem('finances')) || [];
    let finance = finances.find(function (finance) {
        return finance.id === id;
    });
    let row = document.querySelector(`tr[data_index="${id}"]`);
    finance.type = row.children[0].querySelector('select') ? row.children[0].querySelector('select').value : row.children[0].innerHTML;
    finance.title = row.children[1].innerHTML;
    finance.amount = row.children[2].innerHTML;
    finance.date = row.children[3].innerHTML;
    localStorage.setItem('finances', JSON.stringify(finances));
    render_finances();
}

// function to handle the dropdown
function handle_dropdown() {


// function to handle the dropdown
const handle_dropdowns = document.querySelectorAll('[handle_dropdown]')

handle_dropdowns.forEach(handle_dropdown => {
    handle_dropdown.addEventListener('click', function (e) {
        // check if the element already has the active class
        if (this.classList.contains('active')) {
            return;
        }
        
        const curren_value = this.innerHTML;
        this.innerHTML = '';
        this.classList.add('active');
        let dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
    //   change the above code to select tag instead of div
    dropdown.innerHTML = `<select class="form-control">
    <option value="income" ${curren_value=='income' ? 'selected' : ''}>income</option>
    <option value="expense" ${curren_value=='expense' ? 'selected' : ''}>expense</option>
    </select>`;
        this.appendChild(dropdown);
});
});
}