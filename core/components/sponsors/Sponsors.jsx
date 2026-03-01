import React from "react";
import styles from "./Sponsors.module.css";
import { sponsorsList } from "./sponsorsList.js";

const Sponsors = () => {
  const activeSponsors = sponsorsList.filter((s) => s.active);

  return (
    <section
      className={styles.poweredByContainer}
      aria-labelledby="powered-by-heading-text"
    >
      <div className={styles.poweredByHeading}>
        <h3 id="powered-by-heading-text" className={styles.poweredByHeadingText}>
          POWERED BY...
        </h3>
      </div>

      <div className={styles.poweredByContainerInner}>
        <ul className={styles.poweredBySponsorsContainer}>
          {activeSponsors.map((sponsor, index) => (
            <li className={`${styles.poweredByLogoContainer} sponsorItem-${index + 1}`} key={sponsor.id}>
              <a
                className={`${styles.poweredByLogo} sponsor-${index + 1}`}
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${sponsor.name}`}
              >
                <img
                  className={styles.sponsorLogo}
                  src={sponsor.logo}
                  alt={sponsor.alt}
                  loading="lazy"
                />
              </a>
            </li>
          ))}

          <li
            className={`${styles.poweredByLogoContainer} ${styles.poweredByLogoContainerPublic}`}
          >
            <p className={styles.sponsorLogoPublic}>
              ...and the public for sponsoring sharks or purchasing the mobile
              app
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Sponsors;
