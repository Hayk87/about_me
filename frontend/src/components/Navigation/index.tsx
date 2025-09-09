import { useCallback, useState, useMemo } from "react";
import { Nav, NavItem, NavLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { RootState } from "../../store";
import { NavbarMenuInterface } from "../../interfaces";
import { rightsMapperData, checkPermission, useTranslate, applicationBaseURL, token_key, tokenStorage, adminPagesPath } from "../../utils";
import { logoutFromSystem } from "../../api/requests";
import { initProfile } from "../../store/slices/profile";
import styles from "./style.module.scss";

const menuData: NavbarMenuInterface[] = [
  { path: adminPagesPath.dashboard, name: 'dashboard' },
  { path: adminPagesPath.translates, viewPagePermission: rightsMapperData.translateRead, name: 'translates' },
  { path: adminPagesPath.staffs, viewPagePermission: rightsMapperData.staffRead, name: 'staffs' },
  { path: adminPagesPath.systemUsers, viewPagePermission: rightsMapperData.systemUserRead, name: 'system_users' },
  { path: adminPagesPath.offers, viewPagePermission: rightsMapperData.offerRead, name: 'offers' },
  // { path: adminPagesPath.measurements, viewPagePermission: rightsMapperData.measurementRead, name: 'measurements' },
  // { path: adminPagesPath.productCategories, viewPagePermission: rightsMapperData.productCategoriesRead, name: 'product_categories' },
  // { path: adminPagesPath.products, viewPagePermission: rightsMapperData.productRead, name: 'products' },
  // { path: adminPagesPath.transactionImports, viewPagePermission: rightsMapperData.transactionImportRead, name: 'transaction_imports' },
  // { path: adminPagesPath.transactionExports, viewPagePermission: rightsMapperData.transactionExportRead, name: 'transaction_exports' },
  // { path: adminPagesPath.reports, viewPagePermission: rightsMapperData.reportsPage, name: 'reports' },
];

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useSelector((state: RootState) => state.profile);
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const search = queryString.parse(location.search);
  const lngCode = search.lng || defaultLang.code;
  const currentLang = languages.list.find((item: any) => item.code === lngCode);
  const menus = useMemo(() => menuData
                  .filter(item => item.viewPagePermission ? checkPermission(profile.data, item.viewPagePermission) : true)
                  .map(item => ({ ...item, url: `/${applicationBaseURL ? `${applicationBaseURL}/` : ''}${item.path}` })), [profile.data]);

  const changeLanguage = (lang: string) => async () => {
    const _search = { ...search };
    _search.lng = lang;
    const urlParams = queryString.stringify(_search);
    const url = `${location.pathname}?${urlParams}`;
    navigate(url);
  }

  const changePage = (menu: any) => (ev: any) => {
    ev.preventDefault();
    const URL = `${menu.url}${search.lng ? `?lng=${search.lng}` : ''}`;
    navigate(URL);
  }

  const toggleDropdownOpen = useCallback(() => setDropdownOpen(p => !p), []);

  const logout = (ev: any) => {
    ev.preventDefault();
    logoutFromSystem()
      .catch(err => {
        console.log('logoutFromSystem', err);
      })
      .finally(() => {
        dispatch(initProfile({}));
        tokenStorage.removeItem(token_key);
      });
  }

  return (
    <>
      <Nav className={styles.mainNavigation} tabs={true}>
        {menus.map((menu, i) => (
          <NavItem key={menu.path}>
            <NavLink active={menu.url === location.pathname} onClick={changePage(menu)}>{t(menu.name)}</NavLink>
          </NavItem>
        ))}
        <Dropdown className={styles.dashboardMenu} nav={true} isOpen={dropdownOpen} toggle={toggleDropdownOpen}>
          <DropdownToggle nav caret>
            {currentLang.name}
          </DropdownToggle>
          <DropdownMenu>
            {languages.list.map((item: any) => (
              <DropdownItem key={item.code} onClick={changeLanguage(item.code)} disabled={item.code === currentLang.code}>{item.name}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <NavItem className={styles.dashboardLogoutMenu}>
          <NavLink onClick={logout}>
            <FaArrowRightFromBracket />
            {t('logout')}
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
}

export default Navigation;