import React from 'react';

/* eslint-disable react/prop-types */
export default function PointPopupContent({ idx, date, time, timezone }) {
  const dateLine = date || '';
  const timeLine = [time, timezone].filter(Boolean).join(' ');
  return (
    <div className="track-popup">
      <h3 className="map-heading">{`Location #${idx ?? ''}`.trim()}</h3>
      <div className="map-body">
        {dateLine && <div>{dateLine}</div>}
        {timeLine && <div>{timeLine}</div>}
        {!dateLine && !timeLine && <div>Time: unknown</div>}
      </div>
    </div>
  );
}