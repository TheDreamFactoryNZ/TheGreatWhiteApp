import React, { useEffect, useMemo, useRef } from "react";
import styles from "./Legend.module.css";
import Animal from "./Animal.jsx";
import LastSeenInfo from "../LastSeenInfo.jsx";
import sanitizeHtml from "../../utils/sanitizeHtml.js";

import doubleCaret from "@images/button_icons/double-caret.svg";
import tdfLogo from "@images/the-dream-factory-n-slogan-white.svg";
import erLogo from "@images/LogoEarthRanger.png";
import BackArrow from "@images/button_icons/back-arrow.svg?component";

/* eslint-disable react/prop-types */

function getLastSeenMs(subject) {
  const iso = subject?.last_position?.properties?.DateTime;
  if (typeof iso === "string") {
    const t = new Date(iso).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const epoch = subject?.last_position?.properties?.time_epoch; // optional fallback
  if (typeof epoch === "number") return epoch * 1000;
  return -Infinity; // missing dates go to the end
}

const Legend = ({
  subs,
  subjectData,
  onLocClick,
  legSub,
  onReturnClick,
  onStoryClick,
  legendOpen,
  onLegendStateToggle,
  title,
}) => {
  const doubleCaretIcon = doubleCaret;
  const scrollContainerRef = useRef(null);
  const subsRef = useRef(null);
  const storyRef = useRef(null);

  const sortedSubs = useMemo(() => {
    return [...(subs || [])].sort(
      (a, b) => getLastSeenMs(b) - getLastSeenMs(a),
    );
  }, [subs]);

  // Reset scroll when legend opens or content changes
  useEffect(() => {
    if (!legendOpen) return;

    // Use rAF so the DOM has laid out (images/content can change height)
    const raf = window.requestAnimationFrame(() => {
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
      if (subsRef.current) subsRef.current.scrollTop = 0;
      if (storyRef.current) storyRef.current.scrollTop = 0;
    });

    return () => window.cancelAnimationFrame(raf);
  }, [legendOpen, legSub, sortedSubs.length]);

  function toggleLegend() {
    onLegendStateToggle();
  }

  function display() {
    if (legSub === undefined) {
      return (
        <div className={styles.legendContent}>
          <div className={styles.title}>
            <div className={styles.tracker}>
              <h1 className={styles.mapTitle}>
                {title !== null ? title : "The Great White App"}
              </h1>
            </div>
            <div className={styles.developerLogo}>
              <span className={styles.developerText}>Developed by</span>
              <div className={styles.developerContainer}>
                <div className={styles.developerItem}>
                  <a
                    href="https://thedreamfactory.nz/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img draggable="false" src={tdfLogo} />
                  </a>
                </div>
                <div
                  className={`${styles.developerItem} ${styles.dividerbox}`}
                />
                <div className={styles.developerItem}>
                  <a
                    href="https://earthranger.com/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img draggable="false" src={erLogo} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div ref={subsRef} className={styles.subs}>
            {sortedSubs.map((s) => (
              <div key={s.id} className={styles.subjectDiv}>
                <Animal
                  animal={s}
                  configData={subjectData}
                  key={s.id}
                  animalOnLocClicked={onLocClick}
                  onNameClick={onStoryClick}
                  displayStory={s.display_story}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div className={styles.legendContent}>
            <div className={styles.title}>
              <div className={styles.tracker}>
                <h1 className={styles.mapTitle}>
                  {title !== null ? title : "Animal Tracker"}
                </h1>
              </div>
              <div className={styles.developerLogo}>
                <span className={styles.developerText}>Developed by</span>
                <div className={styles.developerContainer}>
                  <div className={styles.developerItem}>
                    <a
                      href="https://thedreamfactory.nz/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <img draggable="false" src={tdfLogo} />
                    </a>
                  </div>
                  <div
                    className={`${styles.developerItem} ${styles.dividerbox}`}
                  />
                  <div className={styles.developerItem}>
                    <a
                      href="https://earthranger.com/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <img draggable="false" src={erLogo} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => onReturnClick(undefined)}
              className={styles.return}
            >
              <BackArrow
                draggable="false"
                width="7px"
                height="10px"
                className={styles.backArrow}
              />
              <p className="map-body">Back</p>
            </div>
            <div ref={storyRef} className={styles.animalStory}>
              <div className={styles.subjectDiv}>
                <Animal
                  animal={legSub[0]}
                  key={legSub[0].id}
                  configData={subjectData}
                  isStoryView={true}
                  animalOnLocClicked={onLocClick}
                />
              </div>
              {legSub[1].pictures.map((pic) => {
                return (
                  <img
                    draggable="false"
                    className={styles.subImage}
                    key={pic}
                    src={pic.path}
                    alt="picture"
                  />
                );
              })}
              <div className={styles.subContentContainer}>
                <h2 className="map-heading">About {legSub[0].name}</h2>
                <div className={styles.subContentBody}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(legSub[1].detail_description || ""),
                    }}
                  />
                  <div>
                    <p>
                      <em>
                        Last seen{" "}
                        <LastSeenInfo
                          isoDate={
                            legSub[0]?.last_position?.properties?.DateTime
                          }
                          className={`${styles.subContentLastSeenInfo}`}
                          showFullDate={true}
                        />
                      </em>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div
        className={`${styles.legend} ${
          legendOpen ? styles.legendOpen : styles.legendClose
        }`}
      >
        <div className={styles.legendOpenButton} onClick={() => toggleLegend()}>
          <img draggable="false" src={doubleCaretIcon} />
        </div>
        <div ref={scrollContainerRef} className={styles.legendScrollContainer}>
          {display()}
        </div>
      </div>
    </>
  );
};

export default Legend;
