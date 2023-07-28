async function sendPOSTRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error while making the request:', error);
        return null;
    }
}

function updateData(data, assignDict) {
    const urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search));

    sendPOSTRequest("character/update", { ...urlParams, ...data })
        .then(responseData => {
            if (responseData) {
                for (const [key, elmnt] of Object.entries(assignDict)) {
                    if (key in responseData) {
                        if (elmnt.tagName.toLowerCase() == "input") {
                            elmnt.value = responseData[key];
                        }
                        else {
                            elmnt.innerText = responseData[key];
                            placeCaretAtEnd(elmnt)
                        }
                    }
                }
            }
            else {
                console.warn('Failed to get a valid response from API.');
            }
        })
        .catch(error => {
            console.error('Error while processing the request:', error);
        });
}

function createNewItem() {
    const urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search));

    sendPOSTRequest("character/create_new_item", { ...urlParams, })
        .then(responseData => {
            if (responseData) {
            }
            else {
                console.warn('Failed to get a valid response from API.');
            }
        })
        .catch(error => {
            console.error('Error while processing the request:', error);
        });
}

function updateItemData(id, data, assignDict) {
    sendPOSTRequest("character/item/update", { _db: 'items', id: id, ...data })
        .then(responseData => {
            if (responseData) {
                for (const [key, elmnt] of Object.entries(assignDict)) {
                    if (key in responseData) {
                        if (elmnt.tagName.toLowerCase() == "input") {
                            elmnt.value = responseData[key];
                        }
                        else {
                            elmnt.innerText = responseData[key];
                            placeCaretAtEnd(elmnt)
                        }
                    }
                }
            }
            else {
                console.warn('Failed to get a valid response from API.');
            }
        })
        .catch(error => {
            console.error('Error while processing the request:', error);
        });
}

function deleteItem(id) {
    if (!window.confirm("Tem certeza que desejar deletar este item?")) return;

    sendPOSTRequest("character/item/remove", { id: id })
        .then(responseData => {
            if (responseData) {
                const el = document.getElementById(`card_${id}`);
                el.remove();
            }
            else {
                console.warn('Failed to get a valid response from API.');
            }
        })
        .catch(error => {
            console.error('Error while processing the request:', error);
        });
}

function updateProgressBar(id) {
    const bar = document.getElementById(id + "_bar");
    let max = parseInt(document.getElementById(id + "_max").textContent);
    let min = parseInt(document.getElementById(id + "_min").textContent);
    let percentage = 100 * min / (max || 1);

    bar.style.width = `${percentage}%`;
}

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

window.onload = function () {
    // Get all elements with the attribute 'contenteditable'
    const contentEditableElements = document.querySelectorAll('[contenteditable]');

    // Attach 'paste' event listener to each contenteditable element
    contentEditableElements.forEach(function (element) {
        element.addEventListener('paste', function (e) {
            // Strips elements added to the editable tag when pasting
            var self = this;
            setTimeout(function () {
                self.innerHTML = self.textContent;
            }, 0);
        });

        // Attach 'keypress' event listener to ignore the Enter key
        element.addEventListener('keypress', function (e) {
            // Ignore Enter key (key code 13)
            if (e.which === 13) {
                e.preventDefault();
            }
        });
    });

    const progressBarElements = document.querySelectorAll(".progress[id]:not([id=''])");

    progressBarElements.forEach(function (element) {
        updateProgressBar(element.id);
    });
}

// $('[contenteditable]').on('paste', function (e) {
//     //strips elements added to the editable tag when pasting
//     var $self = $(this);
//     setTimeout(function () { $self.html($self.text()); }, 0);
// }).on('keypress', function (e) {
//     //ignores enter key
//     return e.which != 13;
// });