import React, { useContext } from "react";
import { TrackButton, LocateButton } from "@buttons";
import LastSeenInfo from "../LastSeenInfo";
import { getSubjectStatusInfo } from "@utils/subjectStatus.js";
import TrackContext from "@contexts/TrackContext.js";
import styles from "./Animal.module.css";
import StoryIcon from "@images/button_icons/view-story-arrow.svg?component";

/* eslint-disable react/prop-types */
const Animal = ({
  animal,
  configData,
  animalOnLocClicked,
  onNameClick,
  displayStory,
  isStoryView: isStoryViewProp,
}) => {
  const { tracks } = useContext(TrackContext);
  const isStoryView = isStoryViewProp ?? configData === undefined;
  const backgroundColor = { backgroundColor: animal.color };

  // Determine bullet color based on subject status in configData
  const subjectConfig = configData?.subjects?.[animal.id];
  const { status, color: bulletColor } = getSubjectStatusInfo(
    animal,
    subjectConfig,
  );
  const bulletBackgroundStyle = { backgroundColor: bulletColor };

  const animalId = animal.id + " animal";
  let animalName = "animal-name ";
  let display = {};

  const isTrackOn = !!(tracks && tracks[animal.id]);
  const trackState = isTrackOn ? " tracksActive " : "";

  if (configData === undefined || !displayStory) {
    animalName = "";
    display = { visibility: "hidden" };
  }

  return (
    <>
      <div
        className={`${styles.animalLegendContent} ${
            isStoryView ? styles.animalStoryView : ""
          }`}
        onClick={(e) => {
          const fromButton = e.target.closest(
            "#subject-track-button, #subject-location-button",
          );
          if (fromButton) return;

          const name = document.getElementById(animalId);
          const clicked = e.target;

          if (
            name.classList.contains("animal-name") &&
            clicked.id !== "subject-track-button" &&
            clicked.id !== "subject-location-button"
          ) {
            onNameClick([animal, configData.subjects[animal.id]]);
            name.classList.toggle("animal-name");
          }
        }}
      >
          <div className={styles.animalStatus}>
            <div style={bulletBackgroundStyle} />
          </div>
        <div
          className={`${styles.animalNameStatus} ${animalName}`}
          id={animalId}
        >
          <div
            className={`${styles.animalNameStyle} ${
              trackState ? styles.tracksActive : ""
            }`}
            id={animal.name.replace(" ", "-")}
          >
            <h2
              className={`${"map-heading"} ${styles.animalNameText}`}
              title={animal.name}
            >
              {animal.name}
            </h2>
            <LastSeenInfo
              isShorthand={true}
              isoDate={animal?.last_position?.properties?.DateTime}
              timezoneLabel="UTC"
              timezone="Etc/UTC"
              status={status}
              className={`${"map-body"} ${styles.lastSeen}`}
            />
          </div>
        </div>
        <div className={styles.trackButtons}>
          <div className={styles.trackButtonContainer}>
          <TrackButton 
            subject={animal}
            width="auto"
            height="auto"
          />
          </div>
          <div className={styles.trackButtonContainer}>
          <LocateButton
            subject={animal}
            handleOnLocButtonClicked={animalOnLocClicked}
            width="auto"
            height="auto"
          />
          </div>
        </div>
          <button
            className={styles.storyButton}
            onClick={(e) => {
          const fromButton = e.target.closest(
            "#subject-track-button, #subject-location-button",
          );
          if (fromButton) return;

          const name = document.getElementById(animalId);
          const clicked = e.target;

          if (
            name.classList.contains("animal-name") &&
            clicked.id !== "subject-track-button" &&
            clicked.id !== "subject-location-button"
          ) {
            onNameClick([animal, configData.subjects[animal.id]]);
            name.classList.toggle("animal-name");
          }
        }}
          >
            <StoryIcon className={styles.storyButtonIcon} width="2.5rem" height="2.5rem" />
          </button>
        </div>
    </>
  );
};

export default Animal;
