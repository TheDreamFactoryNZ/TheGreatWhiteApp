import React, { useEffect, useState } from "react";
import styles from "./LeaveReviewButton.module.css";
import close from "@images/button_icons/close.svg";
import { useAppVariant } from "@contexts/AppVariantContext.js";

/* eslint-disable react/prop-types */
const LeaveReviewButton = () => {
  const { isDesktop } = useAppVariant();

  // Don't render at all on desktop
  if (isDesktop) {
    return null;
  }

  const [reviewOpen, setReviewOpen] = useState(false);

  // Close when another popup announces it opened
  useEffect(() => {
    const id = "leave-review";
    const onPopupOpen = (e) => {
      try {
        const otherId = e?.detail?.id;
        if (otherId && otherId !== id) {
          setReviewOpen(false);
        }
      } catch (_) {}
    };
    try {
      window.addEventListener("gw:popup-open", onPopupOpen);
    } catch (_) {}
    return () => {
      try {
        window.removeEventListener("gw:popup-open", onPopupOpen);
      } catch (_) {}
    };
  }, []);

  return (
    <div className={styles.leaveReviewContainer}>
      <button
        type="button"
        className={styles.leaveReviewIcon}
        onClick={() => {
          setReviewOpen((prev) => {
            const next = !prev;
            if (next) {
              try {
                window.dispatchEvent(
                  new CustomEvent("gw:popup-open", {
                    detail: { id: "leave-review" },
                  }),
                );
              } catch (_) {}
            }
            return next;
          });
        }}
        aria-expanded={reviewOpen}
        aria-label="Submit feedback and leave a review"
      />

      <div
        className={[
          styles.supportContentContainer,
          !reviewOpen && styles.hidden,
          styles.popupContainer,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.supportHeaderContainer}>
          <h2 className={styles.supportHeader}>Showing Your Support</h2>
          <img
            src={close}
            draggable={false}
            className={styles.closeIcon}
            onClick={() => setReviewOpen(false)}
          />
        </div>
        <div className={styles.supportItemsContainer}>
          <div className={styles.supportItem}>
            <div className={styles.supportTextContainer}>
              <p className="map-body">
                <strong>
                  By purchasing this mobile app, you're doing your part to
                  support the conservation and study of Great White Sharks.
                  Thank you.
                </strong>
              </p>
              <p className="map-body">
                For the first time in New Zealand, supporting a conservation
                study of Great White Sharks is made easy and accessible for the
                general public via this interactive app.
              </p>
              <p className="map-body">
                Enjoying the app? Want to see more sharks and locations? The
                support of the public is what makes this app possible.
              </p>
              <p className="map-body">
                <strong>
                  The more support the app gets, the better resourced we are to
                  improve it and tag more sharks (meaning even more locations).
                </strong>
              </p>
              <p className="map-body">
                Now that you've purchased the app, leaving a review will help
                make this a reality. <em>Already left a review?</em> Thank you
                for your support!
              </p>
              <p className="map-body">
                Interested in sponsoring a tag? E-mail{" "}
                <a href="mailto:sustainableoceansociety@gmail.com">
                  sustainableoceansociety@gmail.com
                </a>{" "}
                for further details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewButton;
