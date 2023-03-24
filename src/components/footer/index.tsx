/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../../styles/Landing.module.css";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["container-footer"]}>
        <div className={styles["left-footer"]}>
          <img
            src="images/logo.png"
            alt="CEMIC"
            className={styles["logo-footer"]}
          />
          <h3>CEMIC© Compartilhe essa ideia!</h3>
          <p>Todos os direitos reservados.</p>
          <p>Contato: (61) 3083-3075 | (61) 98657-3056</p>
        </div>
        <div className={styles["right-footer"]}>
          <h3>Siga-nos em nossas redes sociais!</h3>
          <div className={styles.socials}>
            <Link
              passHref
              target="_blank"
              href={"https://www.facebook.com/tratamentocemic/?locale=pt_BR"}
            >
              <FaFacebookSquare className={styles["social-item"]} />
            </Link>
            <Link
              target="_blank"
              passHref
              href="https://www.instagram.com/cemic_/"
            >
              <FaInstagramSquare className={styles["social-item"]} />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles["pos-footer"]}>
        <a href="http://sofx.vercel.app" target={"_blank"} rel="noreferrer">
          Site desenvolvido por{" "}
          <img
            src="/images/sofx.png"
            alt="sofx - soluções digitais"
            className={styles["sofx-logo"]}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
