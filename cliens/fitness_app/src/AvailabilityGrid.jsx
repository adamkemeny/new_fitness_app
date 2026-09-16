import React from "react";

const DAYS = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

function AvailabilityGrid({isOpen, onClose, value, onChange}){
    if(!isOpen){
        return null;
    }
    const toggleSlot = (day, hour) => {
        const daySlots = value[day] || [];
        const updatedDaySlots = daySlots.includes(hour) ? daySlots.filter((h)=> h !== hour) : [...daySlots, hour].sort((a,b) => a-b);
        onChange({...value,[day]:updatedDaySlots});
    }
    return (
    /* Sötétített háttér (Overlay) */
    <div
      onClick={onClose} // Ha a sötétített részre kattint, bezáródik
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Háttér elsötétítése
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Biztosan minden felett legyen
      }}
    >
      {/* Maga a felugró ablak (Modal) */}
      <div
        onClick={(e) => e.stopPropagation()} // Megakadályozza, hogy az ablakra kattintva bezáródjon
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "800px",
          width: "90%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          color: "#333",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ margin: 0 }}>Mikor érsz rá edzeni?</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✖
          </button>
        </div>

        {/* Órarend Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50px repeat(7, 1fr)",
            gap: "4px",
            userSelect: "none",
          }}
        >
          <div></div>
          {DAYS.map((day) => (
            <div key={day} style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px", padding: "4px", background: "#f0f0f0" }}>
              {day}
            </div>
          ))}

          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div style={{ fontSize: "11px", color: "#666", textAlign: "center", alignSelf: "center" }}>
                {`${hour}:00`}
              </div>
              {DAYS.map((day) => {
                const isSelected = value[day]?.includes(hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    onClick={() => toggleSlot(day, hour)}
                    style={{
                      height: "28px",
                      backgroundColor: isSelected ? "#4CAF50" : "#fafafa",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Kész / Mentés
        </button>
      </div>
    </div>
  );
    
} export default AvailabilityGrid;