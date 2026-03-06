import React from "react";
import { createPortal } from "react-dom";
import TipIcon from "@images/button_icons/tip-icon.svg?component";
import CloseIcon from "@images/button_icons/close.svg?component";
import sanitizeHtml from "../../utils/sanitizeHtml.js";
import iconButtonStyles from "./IconButton.module.css";
import styles from "./TipModal.module.css";

/* eslint-disable react/prop-types */

// Renders a tip button; clicking opens a full-screen modal with a header
// (H2 title + close icon) and a body area for arbitrary content.
// Props:
// - modalTitle: string (required) – rendered inside <h2>
// - modalBody: string | ReactNode – HTML string sanitized then injected, or ReactNode
// - initialOpen?: boolean – start open
// - onOpen?: () => void
// - onClose?: () => void
// - closeOnBackdropClick?: boolean (default true)
// - className?: string – class for the trigger button wrapper
// - overlayClassName?: string – class for full-screen overlay
// - modalDialogClassName?: string – class for modal dialog container
// - headerClassName?: string – class for header container
// - titleClassName?: string – class for the title <h2>
// - bodyClassName?: string – class for body container
// - bodyContentClassName?: string – class for body content
// - closeButtonClassName?: string – class for close button
// - tipButtonClassName?: string – class for the tip button
// - tipIconClassName?: string – class for tip icon
// - portalAfterId?: string – if provided, the modal portal will be rendered as a child of the element with this ID instead of document.body

export default function TipModal({
  modalTitle,
  modalBody,
  initialOpen = false,
  onOpen,
  onClose,
  closeOnBackdropClick = true,
  className,
  overlayClassName,
  modalDialogClassName,
  headerClassName,
  titleClassName,
  bodyClassName,
  bodyContentClassName,
  closeButtonClassName,
  tipButtonClassName,
  tipIconClassName,
  tipIconColorScheme = "default",
  portalIntoId,
  portalAfterId,
}) {
  const overlayClasses = `${styles.modalOverlay} ${overlayClassName || ""}`;
  const dialogClasses = `${styles.modalDialog} ${modalDialogClassName || ""}`;
  const headerClasses = `${styles.modalHeader} ${headerClassName || ""}`;
  const titleClasses = `${styles.modalTitle} ${titleClassName || ""}`;
  const bodyClasses = `${styles.modalBody} ${bodyClassName || ""}`;
  const contentClasses = `${styles.modalBodyContent} ${bodyContentClassName || ""}`;
  const closeBtnClasses = `${styles.closeButton} ${closeButtonClassName || ""}`;
  const tipBtnClasses = `${iconButtonStyles.iconButton} ${tipButtonClassName || ""}`;
  const tipIconClasses = `${iconButtonStyles.iconSvg} ${iconButtonStyles.tipIconSvg} ${tipIconClassName || ""}`;

  const tipIconColor = () => {
    if (tipIconColorScheme === "light") {
      return iconButtonStyles.iconColorLight;
    } else if (tipIconColorScheme === "dark") {
      return iconButtonStyles.iconColorDark;
    }
    return iconButtonStyles.iconColorDefault;
  };

  const [open, setOpen] = React.useState(!!initialOpen);
  const [portalNode, setPortalNode] = React.useState(null);

  const triggerRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const overlayRef = React.useRef(null);
  const titleId = React.useMemo(
    () => `tipmodal-title-${Math.random().toString(36).slice(2)}`,
    [],
  );

  React.useEffect(() => {
    if (!open) {
      setPortalNode(null);
      return undefined;
    }

    // Portal into a stable, existing node
    if (portalIntoId) {
      const existing = document.getElementById(portalIntoId);
      setPortalNode(existing || document.body);
      return undefined;
    }

    // Failing this, portal to body
    if (!portalAfterId) {
      setPortalNode(document.body);
      return undefined;
    }

    // Fallback: create a mount node immediately after an anchor
    const anchor = document.getElementById(portalAfterId);
    if (!anchor || !anchor.parentNode) {
      // Fallback to body if specified anchor not found
      setPortalNode(document.body);
      return undefined;
    }

    const mount = document.createElement("div");
    mount.setAttribute("data-tipmodal-root", "true");
    anchor.insertAdjacentElement("afterend", mount);

    setPortalNode(mount);

    return () => {
      mount.remove();
      setPortalNode(null);
    };
  }, [open, portalIntoId, portalAfterId]);

  React.useEffect(() => {
    if (open) {
      if (typeof onOpen === "function") onOpen();
      const t = setTimeout(() => {
        if (closeRef.current && typeof closeRef.current.focus === "function") {
          closeRef.current.focus();
        }
      }, 0);

      const onKey = (e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          setOpen(false);
        }
      };
      document.addEventListener("keydown", onKey);

      return () => {
        document.removeEventListener("keydown", onKey);
        clearTimeout(t);
      };
    }
    return undefined;
  }, [open, onOpen]);

  React.useEffect(() => {
    if (!open && typeof onClose === "function") onClose();
    if (
      !open &&
      triggerRef.current &&
      typeof triggerRef.current.focus === "function"
    ) {
      triggerRef.current.focus();
    }
  }, [open, onClose]);

  const handleBackdropClick = (e) => {
    if (!closeOnBackdropClick) return;
    if (overlayRef.current && e.target === overlayRef.current) {
      e.preventDefault();
      e.stopPropagation();

      setOpen(false);
    }
  };

  const renderBodyContent = () => {
    if (modalBody == null) return null;
    if (typeof modalBody === "string") {
      const safeHtml = sanitizeHtml(modalBody);
      return (
        <div
          className={contentClasses}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      );
    }
    return <div className={contentClasses}>{modalBody}</div>;
  };

  return (
    <div className={className}>
      <button
        type="button"
        ref={triggerRef}
        className={tipBtnClasses}
        aria-haspopup="dialog"
        aria-expanded={open ? "true" : "false"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <TipIcon
          width="18px"
          height="18px"
          className={`${tipIconClasses} ${tipIconColor()}`}
          aria-hidden="true"
        />
      </button>

      {/* IMPORTANT: guard portalNode so we don't call createPortal with null */}
      {open &&
        portalNode &&
        createPortal(
          <div
            ref={overlayRef}
            className={overlayClasses}
            role="presentation"
            onClick={handleBackdropClick}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={dialogClasses}
            >
              <div className={headerClasses}>
                <h2 id={titleId} className={titleClasses}>{modalTitle}</h2>
                <button
                  type="button"
                  ref={closeRef}
                  className={closeBtnClasses}
                  aria-label="Close"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className={bodyClasses}>
                {renderBodyContent()}
                <button
                  ref={closeRef}
                  className={`${'closeTextButton'} ${styles.modalCloseTextButton}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          portalNode,
        )}
    </div>
  );
}
