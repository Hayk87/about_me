import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const toggleIsOpenMenu = useCallback(() => {
    if (isWindow) return;
    setIsOpenMenu(prev => !prev);
  }, []);

  const changePage = (pathPath: string) => (ev: any) => {
    ev.preventDefault();
    const URL = `${pathPath}${search.lng ? `?lng=${lngCode}` : ''}`;
    navigate(URL);
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