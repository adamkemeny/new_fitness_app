import React from "react";

const DAYS = [
  "Hétfő",
  "Kedd",
  "Szerda",
  "Csütörtök",
  "Péntek",
  "Szombat",
  "Vasárnap",
];

const HOURS = Array.from(
  { length: 16 },
  (_, i) => i + 6,
);

function AvailabilityGrid({
  isOpen,
  onClose,
  value,
  onChange,
}) {
  if (!isOpen) {
    return null;
  }

  const toggleSlot = (day, hour) => {
    const daySlots = value[day] || [];

    const updatedDaySlots =
      daySlots.includes(hour)
        ? daySlots.filter(
            (h) => h !== hour,
          )
        : [
            ...daySlots,
            hour,
          ].sort(
            (a, b) => a - b,
          );

    onChange({
      ...value,
      [day]: updatedDaySlots,
    });
  };

  return (
    <div
      className="availability-overlay"
      onClick={onClose}
    >
      <div
        className="availability-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="availability-header">
          <h3>
            Mikor érsz rá edzeni?
          </h3>

          <button
            type="button"
            className="availability-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>


        {/* GRID */}

        <div className="availability-grid">

          <div></div>

          {DAYS.map((day) => (
            <div
              key={day}
              className="availability-day"
            >
              {day}
            </div>
          ))}


          {HOURS.map((hour) => (
            <React.Fragment key={hour}>

              <div className="availability-hour">
                {hour}:00
              </div>

              {DAYS.map((day) => {
                const isSelected =
                  value[day]?.includes(
                    hour,
                  );

                return (
                  <button
                    type="button"
                    key={`${day}-${hour}`}
                    onClick={() =>
                      toggleSlot(
                        day,
                        hour,
                      )
                    }
                    className={`availability-slot ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    aria-label={`${day} ${hour}:00`}
                    title={`${day} ${hour}:00`}
                  />
                );
              })}

            </React.Fragment>
          ))}

        </div>


        {/* SAVE */}

        <button
          type="button"
          className="availability-save"
          onClick={onClose}
        >
          Kész / Mentés
        </button>

      </div>
    </div>
  );
}

export default AvailabilityGrid;