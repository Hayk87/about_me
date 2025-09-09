import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { RootState } from "../../store";
import styles from "./styles.module.scss";


const LanguagesSwitcher = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const location = useLocation();
  const navigate = useNavigate();
  const search = queryString.parse(location.search);
  const lngCode = search.lng || defaultLang.code;
  const currentLang = languages.list.find((item: any) => item.code === lngCode);

  const toggleIsOpen = useCallback(() => setIsOpen(prev => !prev), []);

  const changeLanguage = (lang: any) => async () => {
    const url = `${location.pathname}?lng=${lang.code}`;
    navigate(url);
  }

  return (
    <>
      <ButtonDropdown isOpen={isOpen} toggle={toggleIsOpen} className={styles.menuButton}>
        <DropdownToggle color="info" className={styles.dropdownToggle} caret>{currentLang.name}</DropdownToggle>
        <DropdownMenu>
          {languages.list.map((item: any) => (
            <DropdownItem key={item.code} onClick={changeLanguage(item)} disabled={item.code === currentLang.code}>{item.name}</DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    </>
  );
}

export default LanguagesSwitcher;