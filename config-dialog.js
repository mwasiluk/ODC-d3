var dialogHtml =
'<dialog class="mdl-dialog">' +
    '<div class="mdl-dialog__content">' +
        '<div id="code-content">' +
            '<h5>Configuration:</h5>' +
            '<pre class="prettyprint lang-js"></pre>' +
        '</div>' +
        '<div id="data-content">' +
            '<h5>Data:</h5>' +
            '<pre class="prettyprint lang-js"></pre>' +
        '</div>' +

    '</div>' +
    '<div class="mdl-dialog__actions">' +
        '<button type="button" class="mdl-button close">Close</button>' +
    '</div>' +
'</dialog>';

jQuery(document).ready(function($){
    $('body').append(dialogHtml);
    var dialog = document.querySelector('dialog');
    var showDialogButton = $('button.show-config-dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.click(function() {
        var button = $(this);
        var configObjName = button.data('configuration');
        if(configObjName){
            $('dialog #code-content').show();
            $('dialog #code-content pre').removeClass('prettyprinted').text(stringify(window[configObjName]));
        }else{
            $('dialog #code-content').hide();
        }
        var dataObjName = button.data('data');
        if(dataObjName){
            $('dialog #data-content').show();
            $('dialog #data-content pre').removeClass('prettyprinted').text(stringify(window[dataObjName]));
        }else{
            $('dialog #data-content').hide();
        }

        prettyPrint();
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
        document.querySelector('.mdl-layout__content').style.overflowX = 'auto';
        document.querySelector('.mdl-layout__content').style.overflowX = '';
    });
});

function stringify(obj){
    var clone = _.cloneDeep(obj);
    stringifyFunctionProps(clone);
    var stringified = JSON.stringify(clone, null, 2);
    stringified = stringified.replace(/"(.*?)":/g, "$1:")
    stringified = stringified.replace(/"function \((.*?)}"/g, "function \($1}")
    stringified = stringified.replace(/\\r\\n/g, "\r\n")
    return stringified;
}

function stringifyFunctionProps(obj) {
    if (!ODCD3.Utils.isObjectNotArray(obj)) {
        return;
    }
    for (var k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue;
        }
        if (ODCD3.Utils.isFunction(obj[k])) {
            obj[k] = obj[k].toString();
            continue;
        }
        if (Array.isArray(obj[k])) {
            obj[k].forEach(stringifyFunctionProps)
        }
        if (ODCD3.Utils.isObject(obj[k])) {
            stringifyFunctionProps(obj[k])
        }
    }
}