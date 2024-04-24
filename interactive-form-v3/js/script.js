document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const job = form.querySelector('select#title');
    const otherJob = job.nextElementSibling;
    const color = form.querySelector('#color');
    const design = form.querySelector('#design');
    const activities = form.querySelector('#activities');
    const activitesCheckboxes = activities.querySelectorAll('#activities input[type="checkbox"]');
    let total = 0;

    const isValid = {

        name: (input) => /^[a-zA-Z]+(?:\s[a-zA-Z]*)*$/.test(input),
        email: (input) => /^[^@]+@[^@.]+\.[a-z]{3}$/i.test(input),
        'cc-num': (input) => /^\d{13,16}$/.test(input),
        zip: (input) => /^\d{5}$/.test(input),
        cvv: (input) => /^\d{3}$/.test(input),
          
        }

    
    otherJob.setAttribute('hidden', '');
    form.querySelector('input').focus();
    enabledColor();
    form.querySelector('#payment').value = 'credit-card';
    paymentOption('credit-card');


    // Hides or shows the other job input if the other option in job role is chosen
    function jobRole() {
        const chosenJob = job.value;
     
        switch(chosenJob) {
             case 'other':
                 otherJob.removeAttribute('hidden');
                 otherJob.disabled = false;
                 break;
             default:
                 otherJob.setAttribute('hidden', '');
                 otherJob.disabled = true;
                 break; 
         }
          
     }

    //Hides or Shows the options of t-shirts that corresponds to the chosen color value
     function tShirt() {
        
         const colorOption = color.querySelectorAll('option[data-theme]');

         if(color.value != 'Select a design theme above') {
            color.value = 'reselect';
         }
         colorOption.forEach(option => {
             (option.dataset.theme != design.value)? option.setAttribute('hidden', ''): option.removeAttribute('hidden');
         } )
     }

    //Enables the color select if a design option is chosen
     function enabledColor() {
            switch(design.value) {
                case 'Select Theme':
                    color.disabled = 'true';
                    break;
                default:
                    color.disabled = '';
                    break
            }
        
    }

    // Hides / shows the div that contains the payment options.
    function paymentOption(method) {
        const payment = {
           paypal : form.querySelector('#paypal'),
           bitcoin : form.querySelector('#bitcoin'),
           'credit-card': form.querySelector('#credit-card')
        }

       for(const key in payment) {
        if(key != method) {
            payment[key].hidden = true;
        } else {
            payment[key].hidden = false;
        }

       }
    }

    // Loops on each checkbox to add focus and blur
    activitesCheckboxes.forEach(checkbox => {

        checkbox.addEventListener('focus', () => {
          checkbox.className = 'focus';
          checkbox.parentNode.className = 'focus';
        });
        checkbox.addEventListener('blur', () => {
          checkbox.className = '';
          checkbox.parentNode.className = '';
        });
    })
    
    activities.addEventListener('change', (e)=>{
        const cost = activities.querySelector('#activities-cost');
        const checkbox = e.target;
        const activitiesDate = activities.querySelectorAll('input[type = "checkbox"]');
        const value = parseInt(checkbox.dataset.cost);
        const currentDate = checkbox.dataset.dayAndTime;
        
        // removes the not valid class on activities div when an option is chosen
        function removeNotValidCheckbox(tagname) {
            tagname.parentNode.parentNode.parentNode.classList.remove('not-valid');
            tagname.parentNode.parentNode.parentNode.lastElementChild.classList.add('hint');
        }
        
        // Logic that checks if a checkbox is checked then calculates the value of the checkbox to add/minus from the total
        switch(checkbox.checked? 'true' : 'false'){
            case 'true':
                total += value;
                removeNotValidCheckbox(checkbox);
                activitiesDate.forEach(date => {
                    if(date !== checkbox && date.dataset.dayAndTime === currentDate){
                        date.parentNode.className = 'disabled';
                        date.disabled = true;
                    }
                })
                break;

            case 'false':
                total -= value;
                activitiesDate.forEach(date => {
                    if(date !== checkbox && date.dataset.dayAndTime === currentDate){
                        date.parentNode.className = '';
                        date.disabled = false;
                    }
                })
                break;
        } 

        cost.textContent = `Total: $${total}`;
    })

    form.addEventListener('change', (e)=> {
        const select = e.target;
        
        // Logic that checks where the change event occurs depending on the ID of the target also performs the functions
        switch(select.id) {
            case 'design':
                enabledColor();
                tShirt();
                removeNotValidSelect(select);
                break;

            case 'title':
                jobRole();
                removeNotValidSelect(select);
                break;

            case 'payment':
                const method = select.value;
                const creditInputs = select.parentNode.parentNode.querySelectorAll('*');
                paymentOption(method);
                handlePaymentNotVal(creditInputs);
                break;

            case 'color':
            case 'exp-year':
            case 'exp-month':
                removeNotValidSelect(select);
                break;
            
        }

        // Removes the not-valid class depending on the tag(select or input) if the payment credit card is not chosen
        function handlePaymentNotVal(tagname) {

            tagname.forEach(tags => {
                if(tags.tagName == 'INPUT' && tags.type == 'text' && !tags.parentNode.parentNode.parentNode.parentNode.hidden) {
                    tags.parentNode.classList.remove('not-valid');
                    tags.nextElementSibling.nextElementSibling.classList.add('hint');
                    tags.value = '';
                    tags.nextElementSibling.style.display = 'none';
                } else if(tags.tagName == 'SELECT' && !tags.parentNode.parentNode.parentNode.hidden && tags.id != 'payment'){
                    tags.previousElementSibling.classList.remove('not-valid');
                    tags.classList.remove('not-valid');
                    tags.value = 0;
                }
            })
        }

        // Function that removes not valid on class on change occurs
        function removeNotValidSelect(tagname) {
            tagname.previousElementSibling.classList.remove('not-valid');
            tagname.classList.remove('not-valid');
        }

    })



    form.addEventListener('input', (e)=> {
        const input = e.target;

        // object literals that returns a regex value depending on the property
       

        function showValid(show, element, error) {
            switch(show? 'not-valid' : 'valid') {
                case 'not-valid':
                    element.className = 'not-valid';
                    error.style.display = 'block';
                    break;

                case 'valid':
                    element.className = 'valid';
                    error.style.display = 'none';
                    break;

            }
        }

        // checks if the input field is empty (responsive)
        function isFieldEmpty(input, label) {

            if(input.value === ''){
                label.classList.add('not-valid');
                input.nextElementSibling.nextElementSibling.classList.remove('hint');
                label.classList.remove('valid');
            } else {
                input.nextElementSibling.nextElementSibling.classList.add('hint');
            }
        }

        // Validates the text field, also checks if it is empty.
        function validation(validator, input) {
            const text = input.value;
            const valid = validator(text);
            const showInputError = text !== '' && !valid;
            const checker = input.parentNode;
            const errorMsg = input.nextElementSibling;
            
            showValid(showInputError, checker, errorMsg);
            isFieldEmpty(input, checker);
        }
        switch(input.id) {
            case 'name':
                validation(isValid.name, input);
                break;
            case 'email':
                validation(isValid.email, input)
                break;
            case 'cc-num':
                validation(isValid['cc-num'], input)
                break;
            case 'zip':
                validation(isValid.zip, input)
                break;
            case 'cvv':
                validation(isValid.cvv, input)
                break;
        }
    })

        form.addEventListener('submit', (e) => {
        const formFields = form.querySelectorAll('input');
        const formSelect = form.querySelectorAll('select');

        const formInputs = [...formFields, ...formSelect];


        // Prevents form from submitting because of error on page
        if(!isFilledCorrectly(formInputs)) e.preventDefault();


        // A function that checks if the the input field, select field is empty or input field has received
        // an in valid regex it returns in invalid result that throws error on the tags.
        function isFilledCorrectly(property){
            let unCheckedBox = 0;
            let valid = true;
            property.forEach(props => {
                if((props.type == 'text' || props.type == 'email') && !props.hidden && !props.parentNode.parentNode.parentNode.parentNode.hidden && props.name != 'other-job-role'){
                    const validationMap = {
                        'name': isValid.name,
                        'cvv': isValid.cvv,
                        'zip': isValid.zip,
                        'cc-num': isValid['cc-num'],
                        'email': isValid.email
                    };
                
                    const validator = validationMap[props.id];
                
                    if (props.value && validator && !validator(props.value)) {
                        props.parentNode.className = 'not-valid';
                        props.nextElementSibling.style.display = 'block';
                        valid = false;
                    } else if (!props.value) {
                        props.parentNode.classList.remove('valid');
                        props.parentNode.classList.add('not-valid');
                        props.nextElementSibling.nextElementSibling.classList.remove('hint');
                        valid = false;
                    }
                } else if(props.type == 'checkbox' && !props.checked) {
                    unCheckedBox+= 1;
                    switch(unCheckedBox){
                        case 7:
                            props.parentNode.parentNode.parentNode.classList.add('not-valid');
                            props.parentNode.parentNode.parentNode.lastElementChild.classList.remove('hint');
                            valid = false;
                            break;
                    } 
                } else if(props.tagName == 'SELECT' && !props.disabled && props.selectedIndex == 0 && !props.parentNode.parentNode.parentNode.hidden){
                        props.previousElementSibling.classList.add('not-valid');
                        props.classList.add('not-valid');
                        valid = false;
                } else if(props.name == 'other-job-role' && props.value == '' && !props.hidden){
                        props.previousElementSibling.previousElementSibling.classList.add('not-valid');
                        valid = false;
                } 
            })

            return valid;
        }
    })      
});


