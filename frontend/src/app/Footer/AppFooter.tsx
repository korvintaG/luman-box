import styles from "./AppFooter.module.css";

/**
 * Компонент футер приложения
 */
export const AppFooterUI = () => (
  <footer className={styles.footer}>
    <div className={styles.contacts}>
      <span className={styles.contact_part}>
        По всем вопросам пишите:{" "}
        <a href="mailto:korvin@sarmat-soft.ru">korvin@sarmat-soft.ru</a>{" "}
      </span>
      <span className={styles.contact_part}>
        {"\u00A0"}или стучитесь в Telegram:{" "}
        <a href="https://t.me/KorvinTag">@KorvinTag</a>
      </span>
    </div>
    <div className={styles.contact_part}>
      Ресурс находится в стадии тестирования. Данные не сохраняются!
    </div>
  </footer>
);
