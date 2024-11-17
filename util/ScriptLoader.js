function loadScript(url, defer = true) {
    const script = $('<script>', {
        src: url,
        defer: defer,
        async: !defer
    });
    $('head').append(script);
}

loadScript('/db/DB.js');
loadScript('/util/CustomAlert.js');
loadScript('/util/GenerateNextID.js');
loadScript('/util/Validate.js');
loadScript('/util/CommonFunctions.js');
loadScript('/model/customer.js');
loadScript('/model/order.js');
loadScript('/model/OrderDetail.js');
loadScript('/model/item.js');
loadScript('/controllers/CustomerController.js');
loadScript('/controllers/OrderController.js');
loadScript('/controllers/ItemController.js');
loadScript('/controllers/HomeController.js');
loadScript('/controllers/IndexController.js');
