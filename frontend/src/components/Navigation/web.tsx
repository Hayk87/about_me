import React, { useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
import { useTranslate, webPagesPath, useDevice } from "../../utils";
import styles from './style.module.scss';

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
    path: 'buy-app',
    title: 'buy_app',
    children: [
      {
        path: 'website',
        title: 'website'
      },
      {
        path: 'internal-software',
        title: 'internal_software'
      }
    ]
  }
];

export const NavigationWeb = (props: NavigationWebProp) => {
  const { isWindow } = useDevice();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(isWindow);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslate();
  const search = useMemo(() => queryString.parse(location.search), [location.search]);

  const toggleIsOpenMenu = useCallback(() => {
    if (isWindow) return;
    setIsOpenMenu(prev => !prev);
  }, []);

  const changePage = (pathPath: string) => (ev: any) => {
    ev.preventDefault();
    const URL = `${pathPath}${search.lng ? `?lng=${search.lng}` : ''}`;
    navigate(URL);
  }

  return (
    <div className={styles.navigationForWeb}>
      <Navbar>
        <NavbarToggler onClick={toggleIsOpenMenu} className={isWindow? 'd-none' : ''} />
        <Collapse isOpen={isOpenMenu} navbar>
          <Nav className="me-auto" navbar={!isWindow}>
            {menu.map(item => {
              const path = `/${item.path}`;
              let activeClass = location.pathname === path ? styles.activeMenu : undefined;
              if (item.children) {
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
              }
              return (
                <NavItem key={item.title}>
                  <NavLink href={path} onClick={changePage(path)} className={activeClass}>{t(item.title)}</NavLink>
                </NavItem>
              );
            })}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}