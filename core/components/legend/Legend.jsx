import React, { useEffect, useMemo, useRef } from "react";
import styles from "./Legend.module.css";
import Animal from "./Animal.jsx";
import LastSeenInfo from "../LastSeenInfo.jsx";
import sanitizeHtml from "@utils/sanitizeHtml.js";
import { getSubjectStatusInfo } from "@utils/subjectStatus.js";
import { getOrderedAttributes, getFormattedAttributes } from "@utils/attributeDefs.js";

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
                  onCloseLegend={toggleLegend}
                />
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      const subject = legSub[0];
      const subjectConfig = legSub[1];
      const { status } = getSubjectStatusInfo(subject, subjectConfig);

      const apiSex = subject?.sex
        ? subject.sex.charAt(0).toUpperCase() + subject.sex.slice(1)
        : null;

      const mergedSubjectConfig = {
        ...subjectConfig,
        attributes: {
          ...(apiSex && { sex: apiSex }),
          ...subjectConfig?.attributes,
        },
      };

        let orderedAttributes = [];
        try {
          orderedAttributes = getFormattedAttributes(mergedSubjectConfig, true);
        } catch (err) {
          console.error("Failed to parse subject attributes:", err);
        }

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
                  animal={subject}
                  key={subject.id}
                  configData={subjectData}
                  isStoryView={true}
                  animalOnLocClicked={onLocClick}
                />
              </div>
              {subjectConfig.pictures.map((pic) => {
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
                <h2 className="map-heading">About {subject.name}</h2>
                <div className={styles.subContentBody}>
                  <div
                  className={styles.subContentItem}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(subjectConfig.detail_description || ""),
                    }}
                  />
                  {orderedAttributes.length > 0 && (
                    <div
                  className={styles.subContentItem}>
                      <h3 className="map-heading">Fast Facts</h3>
                      <p className="map-body">
                        {orderedAttributes.map((attribute) => (
                          <React.Fragment key={attribute.key}>
                            <strong>{attribute.label}: </strong>{attribute.value}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  )}
                  <div className={styles.subContentItem}>
                    <strong>Last seen:</strong>
                    <LastSeenInfo
                      isoDate={subject?.last_position?.properties?.DateTime}
                      showFullDate={true}
                      showActivityText={true}
                      status={status}
                    />
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
    <div className={styles.legendWrapper}>
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
      </div>
    </>
  );
};

export default Legend;
