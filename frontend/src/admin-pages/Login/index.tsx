import React, { useState, useCallback } from 'react';
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { useDispatch } from "react-redux";
import LanguagesSwitcher from '../../components/Languages-switcher';
import { useTranslate, token_key, tokenStorage } from '../../utils';
import styles from './styles.module.scss';
import { LoginInterface } from '../../interfaces';
import { loginToSystem } from '../../api/requests';
import { initProfile } from '../../store/slices/profile';
import Google2FADialog from "../../components/Google2FA-dialog";

export const path: string = 'login';

const initialValues = { email: '', password: '', authenticator_token: '' };

export default function Login() {
  const [form, setForm] = useState<LoginInterface>(initialValues);
  const [errors, setErrors] = useState<LoginInterface>(initialValues);
  const [googleAuthDialog, setGoogleAuthDialog] = useState<boolean>(false);
  const { t } = useTranslate();
  const dispatch = useDispatch();

  const toggleGoogleAuthDialog = () => {
    if (googleAuthDialog) {
      setForm(s => ({ ...s, authenticator_token: '' }));
      setErrors(s => ({ ...s, authenticator_token: '' }));
    }
    setGoogleAuthDialog(p => !p);
  }

  const setTextField = useCallback((key: string) => (ev: any) => {
    setForm(s => ({ ...s, [key]: ev.target.value }));
    setErrors(s => ({ ...s, [key]: '' }));
  }, []);

  const signInToSystem = (ev: any) => {
    ev?.preventDefault();
    setErrors(initialValues);
    loginToSystem(form)
      .then((res: any) => {
        if (res.data.verifyBy2FA) {
          setGoogleAuthDialog(true);
        } else {
          if (googleAuthDialog) {
            setGoogleAuthDialog(false);
          }
          dispatch(initProfile(res.data.system_user));
          tokenStorage.setItem(token_key, res.data.token);
        }
      })
      .catch(err => {
        if (typeof err.response.data.message === 'string') {
          setErrors(prev => ({ ...prev, email: err.response.data.message }));
        } else {
          setErrors(err.response.data.message);
        }
      })
  }

  return (
    <div className={styles.Login}>
      <div className={styles.LoginFormContainer}>
        <LanguagesSwitcher />
        <Form className={styles.LoginForm} onSubmit={signInToSystem}>
          <FormGroup>
            <Label for="email">{t('email')}</Label>
            <Input type="text" id="email" placeholder={t('email')} onInput={setTextField('email')} value={form.email} invalid={!!errors.email} />
            {errors.email && <FormFeedback>{Array.isArray(errors.email) ? errors.email.map(k => t(k)).join(', ') : t(errors.email)}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for="password">{t('password')}</Label>
            <Input type="password" id="password" placeholder={t('password')} onInput={setTextField('password')} value={form.password} invalid={!!errors.password} />
            {errors.password && <FormFeedback>{Array.isArray(errors.password) ? errors.password.map(k => t(k)).join(', ') : t(errors.password)}</FormFeedback>}
          </FormGroup>
          <Button type="submit" color="primary" className={styles.LoginFormSubmitBtn}>
            {t('sign_in')}
          </Button>
        </Form>
        <Google2FADialog
          isOpen={googleAuthDialog}
          toggle={toggleGoogleAuthDialog}
          confirm={signInToSystem}
          error={errors.authenticator_token}
          handle={setTextField('authenticator_token')}
          token={form.authenticator_token}
        />
      </div>
    </div>
  );
}
