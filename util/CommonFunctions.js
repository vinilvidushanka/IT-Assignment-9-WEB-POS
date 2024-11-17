function resetForm(formId, textFieldIds) {
    let form = $(formId);
    form[0].reset(); 
    $(textFieldIds).removeClass('is-invalid is-valid'); 
    $(textFieldIds).next().hide(); 
}

function getCustomerById(id) {
    return customerDatabase.find(c => c.id === id);
}

function getItemByCode(code) {
    return itemDatabase.find(i => i.code === code);
}

