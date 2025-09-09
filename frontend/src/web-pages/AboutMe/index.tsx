import React from 'react';
import { webPagesPath } from "../../utils";
import WebLayout from "../../Layouts/WebLayout";
import styles from "./styles.module.scss";

export const path: string = webPagesPath.aboutPage;
const startedDevelopmentYear = 2015;
const mySelfFullName = 'Hayk Dallkayan';
const mySelfImage = '/images/me.png';

const AboutMePage = () => {
  return (
    <WebLayout>
      <>
        <h1 className={styles.h1}>About me</h1>
        <img src={mySelfImage} alt={mySelfFullName} title={mySelfFullName} className={styles.myselfImage} />
        <div>
          Hi, my name is Hayk, I am a web developer for about {new Date().getFullYear() - startedDevelopmentYear} years. Let me introduce myself.
        </div>
        <div>
          I've started working as web developer since {startedDevelopmentYear}. First 5 years I worked with PHP
          (HTML, CSS, JS, JQUERY, PHP, PHP OOP, MySQL, PDO). Since May of 2020 I've started work
          as Javascript engineer (ReactJS, NodeJS, NestJS, PostgreSQL, Mongodb, Mongoose).
        </div>
        <div>
          I make websites and internal systems with JavaScript, for backend I use NestJS, database with PostgreSQL, for frontend I use ReactJS.
          Your application will have responsivibility, multilingual, admin panel accassable by IP addresses, user-right managment tools in admin panel.
        </div>
        <div>If you looking for websites or internal systems, you are right place.</div>
      </>
    </WebLayout>
  );
}

export default AboutMePage;