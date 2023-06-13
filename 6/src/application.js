import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
const updateProcessState = (elements, processState) => {

  switch (processState) {

    case 'sent':
      elements.container.innerHTML = 'User Created!';
      return;

    case 'error':
      elements.submitButton.disabled = false;
      return;

    case 'sending':
      elements.submitButton.disabled = true;
      return;

    case 'filling':
      elements.submitButton.disabled = false;
      return;

    default:
      
      throw new Error(`Unknown process state: ${processState}`);
  }
};


const renderErrors = (elements, errors, previousErrors) => {

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {

    const err = errors[fieldName];
    
    const fieldHadError = has(previousErrors, fieldName);
    const currentFieldHasError = has(errors, fieldName);

    if (!fieldHadError && !currentFieldHasError) {

      return;
    }

    if (fieldHadError && !currentFieldHasError) {

      fieldElement.classList.remove('is-invalid');
      fieldElement.nextElementSibling.remove();
      return;
    }

    if (fieldHadError && currentFieldHasError) {

      const feedbackElement = fieldElement.nextElementSibling;
      feedbackElement.textContent = err.message;
      return;
    }

    fieldElement.classList.add('is-invalid');
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.textContent = err.message;
    fieldElement.after(feedbackElement);
  });
};

const render = (formElements) => (path, inputValue, prevValue) => {

  switch (path) {

    case 'form.processState':
      updateProcessState(formElements, inputValue);
      return;

    case 'form.processError':
      handleFormError();
      return;

    case 'form.valid':
      formElements.submitButton.disabled = !inputValue;
      return;

    case 'form.errors':
      renderErrors(formElements, inputValue, prevValue);
      return;

    default:
      return;
  }
};

export default () => {

  const elements = {

    container: document.querySelector('[data-container="sign-up"]'),
    form: document.querySelector('[data-form="sign-up"]'),
    fields: {

      name: document.getElementById('sign-up-name'),
      email: document.getElementById('sign-up-email'),
      password: document.getElementById('sign-up-password'),
      passwordConfirmation: document.getElementById('sign-up-password-confirmation'),
    },
    submitButton: document.querySelector('input[type="submit"]'),
  };
 
  const state = onChange({

    form: {

      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
      fields: {

        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
    },
  }, render(elements));

  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {

    fieldElement.addEventListener('input', (e) => {

      const { value } = e.target;
      state.form.fields[fieldName] = value;
      const errors = validate(state.form.fields);
      state.form.errors = errors;
      state.form.valid = isEmpty(errors);
    });
  });

  elements.form.addEventListener('submit', async (e) => {

    e.preventDefault();

    state.form.processState = 'sending';
    state.form.processError = null;

    try {

      const data = {

        name: state.form.fields.name,
        email: state.form.fields.email,
        password: state.form.fields.password,
      };

      await axios.post(routes.usersPath(), data);
      state.form.processState = 'sent';
    } catch (err) {
  
      state.form.processState = 'error crash';
      state.form.processError = errorMessages.network.error;
      throw err;
    }
  });
};
// END