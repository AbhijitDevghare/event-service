const AppError = require("../utils/error.utils");

class EventDto {
  constructor(data = {}) {
    this.event_name = EventDto.#toString(data.event_name);
    this.description = EventDto.#toString(data.description);
    this.location = EventDto.#toLocation(data.location);

    this.scheduled_date = EventDto.#toDateOnly(data.scheduled_date);
    this.start_time = EventDto.#toTime(data.start_time);
    this.end_time = EventDto.#toTime(data.end_time);

    this.capacity = EventDto.#toInt(data.capacity);
    this.tags = EventDto.#toStringArray(data.tags);
    this.status = EventDto.#toEnum(data.status, ["draft", "published", "cancelled", "completed", "rewarded"], "draft");

    this.points = EventDto.#toInt(data.points) ?? 0;
    this.badge_id = EventDto.#toUUID(data.badge_id);
  }

  static fromRequest(body = {}, options = { partial: false }) {
    const dto = new EventDto(body);

    if (!options?.partial) {
      if (!dto.event_name) throw new AppError("event_name is required", 400);
      if (!dto.scheduled_date) throw new AppError("scheduled_date is required", 400);
      if (!dto.start_time) throw new AppError("start_time is required", 400);
      if (!dto.end_time) throw new AppError("end_time is required", 400);
      if (!dto.badge_id) throw new AppError("badge_id is required", 400);
    }

    return dto;
  }

  static toUpdatePayload(body = {}) {
    const dto = new EventDto(body);
    const out = {};
    const consider = [
      "event_name",
      "description",
      "location",
      "scheduled_date",
      "start_time",
      "end_time",
      "capacity",
      "tags",
      "status",
      "points",
      "badge_id",
    ];
    for (const key of consider) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        out[key] = dto[key];
      }
    }
    return out;
  }

  toPersistence() {
    return {
      event_name: this.event_name,
      description: this.description,
      location: this.location,
      scheduled_date: this.scheduled_date,
      start_time: this.start_time,
      end_time: this.end_time,
      capacity: this.capacity,
      tags: this.tags,
      status: this.status,
      points: this.points,
      badge_id: this.badge_id,
    };
  }

  // --- Helpers ---
  static #toString(v) {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s.length ? s : null;
  }

  static #toTime(v) {
    if (!v) return null;
    if (typeof v === "string") {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
      return timeRegex.test(v.trim()) ? v.trim() : null;
    }
    if (v instanceof Date) {
      return v.toTimeString().split(" ")[0]; // HH:mm:ss
    }
    return null;
  }

  static #toDateOnly(v) {
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split("T")[0];
  }

  static #toInt(v) {
    if (v === undefined || v === null || v === "") return null;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  }

  static #toStringArray(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v.map((x) => String(x));
    if (typeof v === "string") {
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  static #toEnum(v, allowed = [], defaultVal = null) {
    if (!v) return defaultVal;
    return allowed.includes(v) ? v : defaultVal;
  }

  static #toUUID(v) {
    if (!v) return null;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(v) ? v : null;
  }

  static #toLocation(v) {
    if (!v) return null;
    if (typeof v === "string") {
      try {
        v = JSON.parse(v);
      } catch {
        return null;
      }
    }
    if (typeof v === "object" && "lat" in v && "long" in v && "address" in v) {
      return v;
    }
    return null;
  }
}

module.exports = EventDto;
