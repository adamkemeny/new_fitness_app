import { useState } from "react";
import axios from "./API/axios";
import "./PlanRating.css";

export default function PlanRating({ plan, onSaved }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(plan.feedback ?? 0);
  const [comment, setComment] = useState(plan.feedbackText ?? "");
  const [hovered, setHovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = () => {
    setRating(plan.feedback ?? 0);
    setComment(plan.feedbackText ?? "");
    setHovered(0);
    setError("");
    setIsOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Kérlek válassz 1 és 5 közötti csillagot!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/plan/feedback", {
        planID: plan._id,
        rating,
        comment: comment.trim()
      });

      onSaved?.({
        feedback: res.data.feedback.rating,
        feedbackText: res.data.feedback.comment,
        feedbackAt: res.data.feedback.createdAt
      });

      setIsOpen(false);
    } catch (error) {
      setError(
        error.response?.data?.error ??
        "Nem sikerült elmenteni az értékelést."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="plan-rating">
      <button
        type="button"
        className="rating-toggle"
        onClick={() => {
          if (isOpen) {
            handleCancel();
          } else {
            setIsOpen(true);
          }
        }}
        aria-expanded={isOpen}
      >
        ⭐ {plan.feedback ? "Értékelés módosítása" : "Terv értékelése"}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {plan.feedback != null && !isOpen && (
        <p className="rating-saved">
          Korábbi értékelésed: {"★".repeat(plan.feedback)}
          {"☆".repeat(5 - plan.feedback)}
        </p>
      )}

      {isOpen && (
        <form className="rating-form" onSubmit={handleSubmit}>
          <h3>Mennyire vagy elégedett a tervvel?</h3>

          <div className="rating-stars" role="group"
               aria-label="Csillagos értékelés">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={
                  star <= (hovered || rating)
                    ? "rating-star active"
                    : "rating-star"
                }
                aria-label={`${star} csillag`}
                aria-pressed={rating === star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
              >
                {star <= (hovered || rating) ? "★" : "☆"}
              </button>
            ))}
          </div>

          <p className="rating-label">
            {rating ? `${rating} / 5 csillag` : "Válassz egy értékelést"}
          </p>

          <label htmlFor="rating-comment">
            Szöveges értékelés (opcionális)
          </label>

          <textarea
            id="rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Mi tetszett a tervben? Min változtatnál?"
            rows={4}
            maxLength={1000}
          />

          {error && <p role="alert" className="rating-error">{error}</p>}

          <div className="rating-actions">
            <button
              type="submit"
              className="rating-submit"
              disabled={loading || rating === 0}
            >
              {loading ? "Mentés..." : "Küldés"}
            </button>

            <button
              type="button"
              className="rating-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Mégsem
            </button>
          </div>
        </form>
      )}
    </section>
  );
}