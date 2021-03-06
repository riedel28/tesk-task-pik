import React from 'react';
import Textarea from 'react-textarea-autosize';
import { Field, reduxForm } from 'redux-form';
import Button from './Button';

const isCreditAllowed = num => {
  const year = Number(num.slice(6, 10));

  const now = new Date();
  const presentYear = now.getFullYear();

  const maxAge = presentYear - 74;
  const minAge = presentYear - 18;

  if (year >= maxAge && year <= minAge) {
    return true;
  }

  return false;
};

const submitValues = values => {
  console.log(values);
};

const validate = values => {
  const errors = {};

  const dateRegExp = '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$';

  if (!values.email) {
    errors.email = 'Введите email';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!values.birthdate) {
    errors.birthdate = 'Введите дату рождения';
  } else if (!values.birthdate.match(dateRegExp)) {
    errors.birthdate = 'Неверный формат';
  } else if (!isCreditAllowed(values.birthdate)) {
    errors.birthdate = 'Ипотечный кредит предоставляется гражданам РФ в возрасте от 18 до 74 лет';
  }

  if (!values.message) {
    errors.message = 'Введите сообщение';
  }

  return errors;
};

const renderInput = ({
  input, type, label, placeholder, meta: { touched, error, dirty },
}) => (
  <div className="input-field">
    {dirty && <label className="show">{label}</label>}
    {label === 'Сообщение' ? (
      <Textarea
        {...input}
        placeholder={placeholder}
        type={type}
        className={touched && error ? 'input-error' : ''}
      />
    ) : (
      <input
        {...input}
        type={type}
        placeholder={placeholder}
        className={touched && error ? 'input-error' : ''}
      />
    )}
    {touched && (error && <span className="error-message">{error}</span>)}
  </div>
);

const MessageForm = props => {
  const {
    handleSubmit, pristine, submitting, reset, submitSucceeded,
  } = props;
  return (
    <form className="form" onSubmit={handleSubmit(submitValues)}>
      <h2 className="form-title">Отправить сообщение</h2>
      <p className="form-subtitle">Анонимные сообщения рассматриваются</p>
      <div className="inputs-container">
        <Field label="Имя" type="text" name="name" component={renderInput} placeholder="Имя" />
        <Field
          label="Email"
          type="email"
          name="email"
          component={renderInput}
          placeholder="Email"
        />
        <Field
          label="Дата рождения"
          type="text"
          name="birthdate"
          component={renderInput}
          placeholder="Дата рождения"
        />
      </div>
      <Field
        label="Сообщение"
        type="text"
        name="message"
        component={renderInput}
        placeholder="Сообщение"
      />
      {submitSucceeded && <p className="submit-message">Сообщение отправлено!</p>}
      <div className="btn-container">
        <Button className="btn btn-clear" type="button" onClick={reset} disabled={pristine}>
          Очистить
        </Button>
        <Button className="btn" type="submit" disabled={pristine || submitting}>
          Отправить
        </Button>
      </div>
    </form>
  );
};

export default reduxForm({
  validate,
  form: 'MessageForm',
})(MessageForm);
