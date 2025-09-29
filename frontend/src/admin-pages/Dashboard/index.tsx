import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { FaCopy } from "react-icons/fa6";
import { Table, Input, Button, FormFeedback, FormGroup, Label, Alert, Tooltip } from "reactstrap";
import { RootState } from "../../store";
import { changeSystemUserPassword, toggleEnableAuthenticator } from "../../api/requests";
import { useTranslate, adminPagesPath } from "../../utils";
import { useToast } from "../../hooks";
import styles from "./styles.module.scss";

export const path: string = adminPagesPath.dashboard;

interface PasswordStateInterface {
  current_password: string;
  new_password: string;
  repeat_password: string;
}

const passwordState: PasswordStateInterface = { current_password: '', new_password: '', repeat_password: '' };

export default function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordStateInterface>({ ...passwordState });
  const [errorsPasswords, setErrorsPasswords] = useState<PasswordStateInterface>({ ...passwordState });
  const [savePasswordSubmitted, setSavePasswordSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { t } = useTranslate();
  const location = useLocation();
  const { alertSuccess, alertError } = useToast();
  const languages = useSelector((state: RootState) => state.languages);
  const profile = useSelector((state: RootState) => state.profile);
  const [enableGoogleAuth, setEnableGoogleAuth] = useState<{ enabled: boolean, image: string, code: string }>({
    enabled: !!profile.data?.authenticator_enabled,
    image: '',
    code: ''
  });
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const parsed = queryString.parse(location.search);
  const lngCode = parsed.lng || defaultLang.code;

  const handlePassword = (key: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [key]: ev.target.value }));
    setErrorsPasswords(prev => ({ ...prev, [key]: '' }));
  }

  const toggleGoogleAuthenticator = () => {
    toggleEnableAuthenticator(!enableGoogleAuth.enabled)
      .then(res => {
        setEnableGoogleAuth(prev => ({ ...prev, enabled: !prev.enabled, image: res.data.image, code: res.data.code }));
      })
      .catch(err => {
        console.log('toggleEnableAuthenticator.err >>>', err);
      });
  };

  const disablePasswordSaveButton = useMemo(() => !passwords.current_password || !passwords.new_password || savePasswordSubmitted,
    [passwords.current_password, passwords.new_password, savePasswordSubmitted]);

  const savePassword = () => {
    if (disablePasswordSaveButton) return;
    setSavePasswordSubmitted(true);
    setErrorsPasswords(passwordState);
    changeSystemUserPassword(passwords)
      .then(() => {
        alertSuccess(t('successfully_saved'));
        setPasswords(passwordState);
      })
      .catch(err => {
        if (typeof err.response.data.message === 'object') {
          setErrorsPasswords(err.response.data.message);
        } else {
          alertError(`${err.response.data.statusCode}: ${t(err.response.data.message)}`);
        }
      })
      .finally(() => {
        setSavePasswordSubmitted(false);
      });
  }

  const copyCode = () => {
    navigator.clipboard.writeText(enableGoogleAuth.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.Dashboard}>
      <h1>{t('dashboard')}</h1>
      <Table className={styles.systemUserData} bordered>
        <tbody>
          <tr>
            <td className={styles.caption}>{t('first_name')}</td>
            <td className={styles.rightColumn}>{profile.data.first_name}</td>
          </tr>
          <tr>
            <td className={styles.caption}>{t('last_name')}</td>
            <td>{profile.data.last_name}</td>
          </tr>
          <tr>
            <td className={styles.caption}>{t('email')}</td>
            <td>{profile.data.email}</td>
          </tr>
          <tr>
            <td className={styles.caption}>{t('staff_title')}</td>
            <td>{profile.data.staff?.title?.[lngCode]}</td>
          </tr>
          <tr>
            <td className={styles.caption}>{t('current_password')}</td>
            <td>
              <FormGroup>
                <Input
                  type="password"
                  value={passwords.current_password}
                  onChange={handlePassword('current_password')}
                  invalid={!!errorsPasswords.current_password}
                />
                {errorsPasswords.current_password && <FormFeedback>{t(errorsPasswords.current_password)}</FormFeedback>}
              </FormGroup>
            </td>
          </tr>
          <tr>
            <td className={styles.caption}>{t('new_password')}</td>
            <td>
              <FormGroup>
                <Input
                  type="password"
                  value={passwords.new_password}
                  onChange={handlePassword('new_password')}
                  invalid={!!errorsPasswords.new_password}
                />
                {errorsPasswords.new_password && <FormFeedback>{t(errorsPasswords.new_password)}</FormFeedback>}
              </FormGroup>
            </td>
          </tr>
          <tr>
            <td className={styles.caption}>{t('repeat_password')}</td>
            <td>
              <FormGroup>
                <Input
                  type="password"
                  value={passwords.repeat_password}
                  onChange={handlePassword('repeat_password')}
                  invalid={!!errorsPasswords.repeat_password}
                />
                {errorsPasswords.repeat_password && <FormFeedback>{t(errorsPasswords.repeat_password)}</FormFeedback>}
              </FormGroup>
            </td>
          </tr>
          <tr>
            <td className={styles.passwordSaveContainer} colSpan={2}>
              <Button
                type="button"
                color="primary"
                size="sm"
                disabled={disablePasswordSaveButton}
                onClick={savePassword}
              >
                {t('save')}
              </Button>
            </td>
          </tr>
          <tr>
            <td className={styles.authenticatorContainer} colSpan={2}>
              <FormGroup>
                <Input type="checkbox" id="toggleGoogleAuthenticator" onChange={toggleGoogleAuthenticator} checked={enableGoogleAuth.enabled} />
                <Label htmlFor="toggleGoogleAuthenticator">{t('enable_authenticator')}</Label>
              </FormGroup>
              {enableGoogleAuth.enabled && enableGoogleAuth.image && (
                <div>
                  <Alert color="warning">{t('google_authentication_is_enabled')}</Alert>
                  <div className={styles.code}>
                    <span>{t('code')}:</span>{' '}
                    <span>{enableGoogleAuth.code}</span>&nbsp;&nbsp;&nbsp;
                    <span>
                      <FaCopy className={styles.copy} onClick={copyCode} id="copyCodeEl" />
                      <Tooltip
                        placement="top"
                        isOpen={copied}
                        toggle={() => {}}
                        target="copyCodeEl"
                      >
                        {t('copied')}
                      </Tooltip>
                    </span>
                  </div>
                  <img src={enableGoogleAuth.image} />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
