import React from 'react';
import { useLanguage, webPagesPath, classnames } from "../../utils";
import WebLayout from "../../Layouts/WebLayout";
import styles from "./styles.module.scss";

export const path: string = webPagesPath.aboutPage;
const startedDevelopmentYear = 2015;
const mySelfImage = '/images/me.png';
const myLinkedinURL = 'https://www.linkedin.com/in/full-stack-developer-reactjs-nodejs-nestjs/';

const pageContent: Record<string, React.ReactElement> = {
  hy: (
    <div style={{ fontSize: 18 }}>
      <h1 className={styles.h1}>&#128075; Իմ մասին</h1>
      <img src={mySelfImage} alt="Հայկ Դալլաքյան" title="Հայկ Դալլաքյան" className={styles.myselfImage} />
      <div>
        Ես վեբ ծրագրավորող եմ Հայաստանից՝ ավելի քան {new Date().getFullYear() - startedDevelopmentYear} տարվա փորձով։
        Մասնագիտացած եմ բիզնեսների համար անհատական ներքին ծրագրերի մշակման մեջ՝ նպատակ ունենալով օպտիմալացնել գործընթացները և բարձրացնել արդյունավետությունը։
      </div>
      <br />
      <div>
        Տարիների ընթացքում աշխատել եմ տարբեր տեխնոլոգիաների հետ, իսկ այժմ հիմնականում կենտրոնացել եմ <b>Node.js</b>, <b>NestJS</b>, <b>ReactJS</b>&nbsp;
        և <b>PostgreSQL</b> տեխնոլոգիաների վրա։
        Ստեղծում եմ վստահելի, մասշտաբավորվող և սպասարկելի համակարգեր՝ սկսած ադմինիստրացիոն վահանակներից ու տվյալների կառավարման գործիքներից մինչև բիզնես
        ավտոմատացման ամբողջական հարթակներ։
      </div>
      <br/>
      <div>
        Իմ նպատակը յուրաքանչյուր հաճախորդի աշխատանքային հոսքը խորությամբ հասկանալն է և տրամադրել այնպիսի ծրագրային լուծում, որը լիովին
        համապատասխանում է բիզնեսի պահանջներին։
      </div>
      <br/>
      <br/>
      <h3>🛠️ Ինչով եմ զբաղվում</h3>
      <ul>
        <li>
          <b>Անհատական ներքին համակարգեր</b> - CRM-ներ, վահանակներ, վերլուծական գործիքներ և ավտոմատացման լուծումներ
        </li>
        <li>
          <b>API մշակում</b> - Անվտանգ, մասշտաբավորվող և փաստաթղթավորված REST API-ներ
        </li>
        <li>
          <b>Վեբ հավելվածներ</b> - Ժամանակակից, արձագանքող (responsive) ինտերֆեյսներ ReactJS-ով
        </li>
        <li>
          <b>Տվյալների բազա</b> - PostgreSQL նախագծում, միգրացիաներ և օպտիմալացում
        </li>
        <li>
          <b>Համակարգերի ինտեգրում</b> - Տարբեր ծառայությունների և գործիքների միավորում մեկ միասնական միջավայրում
        </li>
      </ul>
      <br/>
      <h3>💡 Հմտություններ</h3>
      <ul className={classnames({ [styles.text]: true, [styles.skills]: true })}>
        <li>
          <b>Frontend</b>
          <ul>
            <li>ReactJS, JavaScript (ES6+), TypeScript</li>
            <li>HTML5, CSS3, Sass, Responsive ձևավորումներ</li>
          </ul>
        </li>
        <li>
          <b>Backend</b>
          <ul>
            <li>Node.js, NestJS</li>
            <li>RESTful API նախագծում</li>
            <li>Նույնականացում, թույլտվություններ, դերի վրա հիմնված մուտքի կառավարում</li>
            <li>Ֆայլերի վերբեռնում, ֆոնային առաջադրանքներ և ժամանակացույցեր</li>
          </ul>
        </li>
        <li>
          <b>Տվյալների բազա</b>
          <ul>
            <li>PostgreSQL (սխեմաների նախագծում, միգրացիաներ, օպտիմալացում)</li>
            <li>TypeORM, հարցումների կառուցում և կապեր</li>
            <li>Փորձ՝ MySQL և MongoDB-ի հետ</li>
          </ul>
        </li>
        <li>
          <b>Գործիքներ և աշխատանքային հոսքեր</b>
          <ul>
            <li>Git, GitHub, WebStorm, VS Code</li>
            <li>Webpack</li>
            <li>Docker (հիմնական օգտագործում)</li>
            <li>API թեստավորում, Swagger ինտեգրացիա</li>
          </ul>
        </li>
      </ul>
      <br/>
      <br/>
      <div className="text-center">
        Սեղմեք <a href={myLinkedinURL} target="_blank" rel="noreferrer">այստեղ</a>՝ ինձ հետ կապ հաստատելու համար <span style={{ fontSize: 20 }}>&#128522;</span>
      </div>
    </div>
  ),
  en: (
    <div>
      <h1 className={styles.h1}>&#128075; About me</h1>
      <img src={mySelfImage} alt="Hayk Dallkayan" title="Hayk Dallkayan" className={styles.myselfImage} />
      <div className={styles.text}>
        I'm a full-stack JavaScript developer from Armenia with over {new Date().getFullYear() - startedDevelopmentYear} years of experience in web development.
        I specialize in building custom internal software that helps businesses streamline operations and improve efficiency.
      </div>
      <br />
      <div className={styles.text}>
        Over the years, I’ve worked with a wide range of technologies, and today my primary focus is on <b>Node.js</b>, <b>NestJS</b>, <b>ReactJS</b>, and <b>PostgreSQL</b>.
        I build reliable, scalable, and maintainable systems — from admin dashboards and data management tools to full-scale business automation platforms.
      </div>
      <br/>
      <div className={styles.text}>
        My goal is to understand each client’s unique workflow and deliver software that perfectly fits their business needs.
      </div>
      <br/>
      <br/>
      <h3>🛠️ What I Do</h3>
      <ul className={styles.text}>
        <li>
          <b>Custom Internal Systems</b> - CRMs, dashboards, analytics tools, and workflow automation.
        </li>
        <li>
          <b>API Development</b> - Secure, scalable, and well-documented REST APIs.
        </li>
        <li>
          <b>Web Applications</b> - Modern, responsive interfaces built with ReactJS.
        </li>
        <li>
          <b>Database Design & Optimization</b> - PostgreSQL with strong data modeling and performance tuning.
        </li>
        <li>
          <b>System Integration</b> - Connecting multiple services and tools into one smooth ecosystem.
        </li>
      </ul>
      <br/>
      <h3>💡 Skills</h3>
      <ul className={classnames({ [styles.text]: true, [styles.skills]: true })}>
        <li>
          <b>Frontend</b>
          <ul>
            <li>ReactJS, JavaScript (ES6+), TypeScript</li>
            <li>HTML5, CSS3, Sass, Responsive Layouts</li>
          </ul>
        </li>
        <li>
          <b>Backend</b>
          <ul>
            <li>Node.js, NestJS</li>
            <li>RESTful API design</li>
            <li>Authentication, authorization, and role-based access control</li>
            <li>File uploads, background jobs, and scheduling</li>
          </ul>
        </li>
        <li>
          <b>Database</b>
          <ul>
            <li>PostgreSQL (schema design, migrations, optimization)</li>
            <li>TypeORM, query building, and relations</li>
            <li>Experience with MySQL and MongoDB</li>
          </ul>
        </li>
        <li>
          <b>Tools & Workflow</b>
          <ul>
            <li>Git, GitHub, WebStorm, VS Code</li>
            <li>Webpack</li>
            <li>Docker (basic usage)</li>
            <li>API testing with Postman, Swagger integration</li>
          </ul>
        </li>
      </ul>
      <br/>
      <br/>
      <div className="text-center">
        Click <a href={myLinkedinURL} target="_blank" rel="noreferrer"><b>here</b></a> for connect with me <span style={{ fontSize: 20 }}>&#128522;</span>
      </div>
    </div>
  ),
}

const AboutMePage = () => {
  const { lngCode } = useLanguage();
  return (
    <WebLayout>
      {pageContent[lngCode]}
    </WebLayout>
  );
}

export default AboutMePage;