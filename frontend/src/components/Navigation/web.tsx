import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useTranslate, webPagesPath, useDevice, useLanguage } from "../../utils";
import { getProductsCategoryForWeb } from "../../api/requests";
import styles from './style.module.scss';
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface NavigationWebProp {

}

interface IMenu {
  path: string;
  title: string;
  children?: IMenu[]
}

const menu: IMenu[] = [
  {
    path: webPagesPath.mainPage,
    title: 'welcome'
  },
  {
    path: webPagesPath.aboutPage,
    title: 'about_me'
  },
  {
    path: webPagesPath.buyApp,
    title: 'buy_app'
  }
];

export const NavigationWeb = (props: NavigationWebProp) => {
  const { isWindow } = useDevice();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(isWindow);
  const [menuData, setMenuData] = useState<IMenu[]>(menu);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const { lngCode, search } = useLanguage();
  const languages = useSelector((state: RootState) => state.languages);
  const currentLang = languages.list.find((item: any) => item.code === lngCode);

  const toggleIsOpenMenu = useCallback(() => {
    if (isWindow) return;
    setIsOpenMenu(prev => !prev);
  }, []);

  const changePage = (pathPath: string) => (ev: any) => {
    ev.preventDefault();
    const URL = `${pathPath}${search.lng ? `?lng=${lngCode}` : ''}`;
    navigate(URL);
  }

  const changeLanguage = (lang: string) => async () => {
    const _search = { ...search };
    _search.lng = lang;
    const urlParams = queryString.stringify(_search);
    const url = `${location.pathname}?${urlParams}`;
    navigate(url);
  }

  useEffect(() => {
    getProductsCategoryForWeb()
      .then(res => {
        setMenuData(prev => {
          prev.forEach(item => {
            if (item.path === webPagesPath.buyApp) {
              item.children = res.data.list.map((item: any) => ({ path: item.product_category_code, title: item.product_category_title[lngCode] }));
            }
          });
          return [...prev];
        });
      })
      .catch(err => console.log(err))
  }, [lngCode]);

  return (
    <div className={styles.navigationForWeb}>
      <Navbar>
        <NavbarToggler onClick={toggleIsOpenMenu} className={isWindow? 'd-none' : ''} />
        <Collapse isOpen={isOpenMenu} navbar>
          <Nav className="me-auto" navbar={!isWindow}>
            {menuData.map(item => {
              const path = `/${item.path}`;
              let activeClass = location.pathname === path ? styles.activeMenu : undefined;
              if (item.children?.length) {
                return (
                  <UncontrolledDropdown nav inNavbar key={item.title}>
                    <DropdownToggle nav caret>
                      {t(item.title)}
                    </DropdownToggle>
                    <DropdownMenu>
                      {item.children.map(child => {
                        const subPath = `${path}/${child.path}`;
                        return (
                          <DropdownItem key={child.title} href={subPath} onClick={changePage(subPath)} className={activeClass}>{t(child.title)}</DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                );
              } else if (item.title === 'buy_app') {
                return null;
              }
              return (
                <NavItem key={item.title}>
                  <NavLink href={path} onClick={changePage(path)} className={activeClass}>{t(item.title)}</NavLink>
                </NavItem>
              );
            })}
            <UncontrolledDropdown nav inNavbar style={isWindow ? { margin: '0 auto', marginRight: 0 } : {}}>
              <DropdownToggle nav caret>
                {currentLang.name}
              </DropdownToggle>
              <DropdownMenu>
                {languages.list.map((item: any) => (
                  <DropdownItem key={item.code} onClick={changeLanguage(item.code)} disabled={item.code === currentLang.code}>{item.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}