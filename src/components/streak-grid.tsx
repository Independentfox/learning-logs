import { logs } from "@/content/logs";
import { cn } from "@/lib/utils";

const WEEKS = 24;
const DAY_MS = 86_400_000;

/** Today in India as YYYY-MM-DD — logs are dated in IST. */
function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

/** GitHub-style grid of the last few months: one square per day, filled when there's a log. */
export function StreakGrid() {
  const today = todayInIndia();
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  // Columns are Sunday→Saturday weeks; the last one is the current week.
  const end = todayMs + (6 - new Date(todayMs).getUTCDay()) * DAY_MS;
  const start = end - (WEEKS * 7 - 1) * DAY_MS;
  const logged = new Set(logs.map((log) => log.date));

  const days = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const ms = start + i * DAY_MS;
    const date = new Date(ms).toISOString().slice(0, 10);
    return { date, future: ms > todayMs, logged: logged.has(date), today: date === today };
  });
  const count = days.filter((day) => day.logged).length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[0.8125rem]">
        <span className="text-muted">
          <span className="font-medium text-fg tabular-nums">{count}</span> {count === 1 ? "day" : "days"}{" "}
          logged
        </span>
        <span className="text-subtle">Last {WEEKS} weeks</span>
      </div>
      <div
        role="img"
        aria-label={`${count} ${count === 1 ? "day" : "days"} logged in the last ${WEEKS} weeks`}
        className="mt-3 grid grid-flow-col grid-rows-7 gap-[0.1875rem]"
        style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
      >
        {days.map((day) => (
          <span
            key={day.date}
            title={day.future ? undefined : `${day.date}${day.logged ? " · logged" : ""}`}
            className={cn(
              "aspect-square rounded-[0.1875rem]",
              day.future ? "bg-transparent" : day.logged ? "bg-accent" : "bg-line",
              day.today && "ring-1 ring-link",
            )}
          />
        ))}
      </div>
    </div>
  );
}
