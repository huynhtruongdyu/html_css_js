document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    const ENUMS = {
        FORM_CLASS: ".free-ink-bottle-campaign form",
        ELEMENT_SELECT2: ".brother-select2 select"
    }

    var forms = document.querySelectorAll(ENUMS.FORM_CLASS);
    Array.prototype.slice.call(forms).forEach(function (form) {
        initSubmitForm(form);

        const serialErrorMessage = $("#SerialErrorMessage");

        serialErrorMessage.css({
            "color": "red",
            "font-size": "14px",
            "border": "0px",
            "background-color": "var(--br-color-background)",
        })

    });

    function ValidateSerial(form) {
        const $serialInput = $(form).find("input[name='Serial']");
        if ($serialInput.length === 0) return true;

        const inputEl = $serialInput[0];
        const value = inputEl.value.trim();
        const invalidEmptyFeedback = inputEl?.nextElementSibling;
        invalidEmptyFeedback?.style.display = 'none';

        if (!value) {
            invalidEmptyFeedback?.style.display = 'block';
            inputEl.setCustomValidity(""); // native `required` handle empty case
            return true;
        }

        if (value.length !== 15) {
            inputEl.setCustomValidity("error");
            return false;
        }

        const validPrefixes = ["E835", "E836", "E837"];
        const isValid = validPrefixes.some(prefix => value.startsWith(prefix));

        if (!isValid) {
            inputEl.setCustomValidity("error");
            return false;
        }

        inputEl.setCustomValidity(""); 
        return true;
    }

    function onValidate(form) {
        form.classList.add("was-validated");

        const isValidRecapcha = validCaptcha(form);
        const isValidEmail = validEmailWithOtp(form);
        const isValidFile = validFileMulti(form);
        const isValidReadOnly = validReadOnly(form);
        const isValidForm = form.checkValidity();

        return isValidRecapcha
            && isValidEmail
            && isValidFile
            && isValidReadOnly
            && isValidForm
    }
    function initSubmitForm(form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            event.stopPropagation();

            try {
                const passValid = onValidate && onValidate(form);

                if (!passValid) {
                    if (!ValidateSerial(form)) {
                        $('#SerialErrorMessage').attr('type', 'text');
                    }
                    else {
                        $('#SerialErrorMessage').attr('type', 'hidden');
                    }
                    return scrollToError(form);
                }

                if (!ValidateSerial(form)) {
                    $('#SerialErrorMessage').attr('type', 'text');
                    return scrollToError(form);
                }
                else {
                    $('#SerialErrorMessage').attr('type', 'hidden');
                }

                const formData = getDataFormData && getDataFormData(form) || {};

                callSubmitAjax && callSubmitAjax({
                    action: "/brotherapi/BrotherForm/SaveData",
                    formData: formData.formDataSubmit,
                    complete: function (data) {
                    },
                    statusCode: {
                        200: function (data) {
                            grecaptcha.reset();

                        },
                        302: function (response) {
                            const data = response.responseJSON;
                            const formComponent = $(form).parent()
                                .closest(".form-open-marketing-page");
                            if (formComponent.length) {
                                window.open(data.Data, "_self");
                                return;
                            }
                            window.location.replace(data.Data);
                        }
                    }
                });
            }
            catch (err) {
                event.preventDefault();
                event.stopPropagation();
                throw err;
            }
        }, false);
    }

});