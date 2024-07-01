import { FC } from 'react';
import { aboutList} from './data';
import styles from './about-page.module.css';
import wiki_no from '../../images/wiki-no.png'

export const AboutPage: FC = () => {
    return (
      <main className={styles.about}>
        <ul className={styles.list}>
        {aboutList.map(
          (el)=>
          <li className={styles.list_element}>
          <article className={styles.article} 
          style={{
            backgroundImage: `url(${(el.image)})`
          }}>
            <div className={`${styles.overlay} ${styles.card_content}`}>
              <img src={el.icon} className={styles.icon}/> 
              <div dangerouslySetInnerHTML={
                { __html: el.text }             }>
              </div>
            </div>
          </article>
          </li>
        )}
        </ul>
        <section className={styles.wikino}>
          <img src={wiki_no} className={styles.wikino_img}/>
          <article className={styles.wikino_article}>
                <h2>Wikipedia</h2>
                <p>Здесь вы не найдете Wiki или нечто на нее похожее. <a href="">Wikipedia создавалась как инструмент тоталитарного ментального диктата</a> с иллюзией  плюрализма. Ни одна Wiki не хочет сомнений и критики пропагандируемых в ней идей. Потому что это задевает интересы хозяев конкретного Wiki-ресурса.</p>
                <p>В отличии от администраторов Wiki, мы создали свой ресурс совершенно для других целей. Мы хотим получить знание для решения конкретных насущных проблем. Мы понимаем, что этого знания сейчас у нас нет. И что только совместная работа над ним единомышленников позволит это знание добыть. <a href="">За работу, товарищи!</a></p>
          </article>
        </section>
      </main>);
      
    
  };
  