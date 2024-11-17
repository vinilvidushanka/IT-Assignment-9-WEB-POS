initializeNextCustomerId();
loadAllCustomers();


$('#save-customer input, #save-customer textarea').on('input change', realTimeValidate);
$('#update-customer input, #update-customer textarea').on('input change', realTimeValidate);

$('#txt-search-valuec').on('input change', function () {
    const value = $(this).val();
    const option = $('#search-customer-by').val();

    const patterns = {
        'ID': /^C[0-9]{3,}$/,
        'Name': /^([A-Z]\.[A-Z]\. )?[A-Z][a-z]*( [A-Z][a-z]*)*$/,
        'Contact No': /^[0-9]{10}$/
    };

    if (patterns[option]) {
        realTimeValidateInput(value, patterns[option], this);
    }
});

$('#search-customer-by').on('change', function () {
    const value = $('#txt-search-valuec').val();
    const option = $(this).val();

    const patterns = {
        'ID': /^C[0-9]{3,}$/,
        'Name': /^([A-Z]\.[A-Z]\. )?[A-Z][a-z]*( [A-Z][a-z]*)*$/,
        'Contact No': /^[0-9]{10}$/
    };

    if (patterns[option]) {
        realTimeValidateInput(value, patterns[option], '#txt-search-valuec');
    }
});

$('#close-savec-btn, #close-savec-icon').on('click', function () { 
    resetForm('#save-customer', '#save-customer input, #save-customer textarea');
    initializeNextCustomerId();
});
$('#close-updatec-btn, #close-updatec-icon').on('click', function () { 
    resetForm('#update-customer', '#update-customer input, #update-customer textarea');
});



function initializeNextCustomerId() {
    const prevId = customerDatabase.length > 0 ? customerDatabase[customerDatabase.length - 1].id : 'C000';
    const nextId = generateNextID(prevId);
    $('#txt-save-cid').val(nextId);
    $('#txt-save-cid').removeClass('is-invalid').addClass('is-valid');
}

function getCustomerByName(name) {
    return customerDatabase.filter(c => c.name === name);
}

function getCustomerByContactNo(contactNo) {
    return customerDatabase.filter(c => c.contactNo === contactNo);
}

function appendToCustomerTable(customer) {
    $('#customer-tbody').append(`
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.contactNo}</td>
        </tr>
    `);
}

function getCustomerByOption(option, value) {
    if (option === 'ID') return getCustomerById(value);
    if (option === 'Name') return getCustomerByName(value);
    if (option === 'Contact No') return getCustomerByContactNo(value);
    return null;
}

function loadAllCustomers() {
    $('#customer-tbody').empty();
    for (const customer of customerDatabase) {
        appendToCustomerTable(customer);
    }
}

function sortCustomerDatabaseById() {
    customerDatabase.sort(function(a, b) {
        const idA = parseInt(a.id.replace('C', ''), 10);  
        const idB = parseInt(b.id.replace('C', ''), 10);  

        return idA - idB;  
    });
}


$('#save-customer').on('submit', function (event) {
    event.preventDefault();

    let isValidated = $('#save-customer input, #save-customer textarea').toArray().every(element => $(element).hasClass('is-valid'));

    if (isValidated) {
        const id = $('#txt-save-cid').val();
        const name = $('#txt-save-cname').val();
        const address = $('#txt-save-caddress').val();
        const contactNo = $('#txt-save-cno').val();

        const customer = new Customer(id, name, address, contactNo);

        if (!customerDatabase.some(c => c.id === id)) {
            customerDatabase.push(customer);
            showToast('success', 'Customer saved successfully !');
            resetForm('#save-customer', '#save-customer input, #save-customer textarea');
            initializeNextCustomerId();
            sortCustomerDatabaseById();
            loadAllCustomers();
            loadCustomerCount();
            initializeOrderComboBoxes();
        } else {
            showToast('error', 'Customer ID already exists !');
        }
    }
});

$('#txt-update-cid').on('input', function (event) {
    if (customerDatabase.some(c => c.id === $(this).val())) {
        const customer = getCustomerById($(this).val());
        $('#txt-update-cname').val(customer.name);
        $('#txt-update-caddress').val(customer.address);
        $('#txt-update-cno').val(customer.contactNo);
        $('#update-customer input, #update-customer textarea').addClass('is-valid').removeClass('is-invalid');
    } else {
        $('#txt-update-cname').val('');
        $('#txt-update-caddress').val('');
        $('#txt-update-cno').val('');
        $('#update-customer input, #update-customer textarea').removeClass('is-valid');
    }
});

$('#update-customer').on('submit', function (event) {
    event.preventDefault();

    let isValidated = $('#update-customer input, #update-customer textarea').toArray().every(element => $(element).hasClass('is-valid'));

    if (isValidated) {
        const id = $('#txt-update-cid').val();
        const name = $('#txt-update-cname').val();
        const address = $('#txt-update-caddress').val();
        const contactNo = $('#txt-update-cno').val();

        const customer = new Customer(id, name, address, contactNo);

        if (customerDatabase.some(c => c.id === id)) {
            const index = customerDatabase.findIndex(c => c.id === id);
            customerDatabase[index] = customer;
            showToast('success', 'Customer updated successfully !');
            resetForm('#update-customer', '#update-customer input, #update-customer textarea');
            loadAllCustomers();
        } else {
            showToast('error', 'Customer ID not found !');
        }
    }
});

$('#search-customer').on('submit', function (event) {
    event.preventDefault();

    let isValidated = $('#txt-search-valuec').hasClass('is-valid');

    if (isValidated) {
        const value = $('#txt-search-valuec').val();
        const option = $('#search-customer-by').val();

        $('#customer-tbody').empty();
        
        const customers = getCustomerByOption(option, value);

        if (Array.isArray(customers) && customers.length > 0) {
            for (const customer of customers) {
                appendToCustomerTable(customer);
            }
            showToast('success', 'Customer search completed successfully !');
        } else if (customers && !Array.isArray(customers)) {
            appendToCustomerTable(customers);
            showToast('success', 'Customer search completed successfully !');
        } else {
            showToast('error', `Customer ${option} not found !`);
        }
    }
});

$('#clear-customer-btn').on('click', function () {
    $('#txt-search-valuec').val('');
    $('#txt-search-valuec').removeClass('is-invalid is-valid');
    $('#txt-search-valuec').next().hide();
    $('#search-customer-by').val('ID');
    $('#customer-tbody').empty();
    showToast('success', 'Customer page cleared !');
});

$('#delete-customer-btn').on('click', function () {
    const value = $('#txt-search-valuec').val();
    const option = $('#search-customer-by').val();

    const customers = getCustomerByOption(option, value);

    if (Array.isArray(customers) && customers.length > 0) {
        $('#confirm-delete-model .modal-body').text('Are you sure you want to delete this customer ?');
        $('#confirm-delete-model').modal('show');

        $('#confirm-delete-btn').one('click', function () {
            for (const customer of customers) {
                const index = customerDatabase.findIndex(c => c.id === customer.id);
                if (index !== -1) {
                    customerDatabase.splice(index, 1);
                }
            }
            showToast('success', 'Customer deleted successfully!');
            $('#confirm-delete-model').modal('hide');  
            loadAllCustomers();
            loadCustomerCount();
            initializeOrderComboBoxes();
        });
    } else if (customers && !Array.isArray(customers)) {
        $('#confirm-delete-model .modal-body').text('Are you sure you want to delete this customer ?');
        $('#confirm-delete-model').modal('show');

        $('#confirm-delete-btn').one('click', function () {
            const index = customerDatabase.findIndex(c => c.id === customers.id);
            if (index !== -1) {
                customerDatabase.splice(index, 1);
            }
            showToast('success', 'Customer deleted successfully!');
            $('#confirm-delete-model').modal('hide');
            loadAllCustomers();
            loadCustomerCount();
            initializeOrderComboBoxes();
        });
    } else {
        showToast('error', `Customer ${option} not found!`);
        loadAllCustomers();
    }
});

$('#load-all-customer-btn').on('click', function () {
    loadAllCustomers();
    showToast('success', 'All customers loaded successfully !');
});