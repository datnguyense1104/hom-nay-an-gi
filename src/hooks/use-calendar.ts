import { useState, useCallback } from "react";

declare const google: any;

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export type CalendarStatus = "idle" | "loading" | "success" | "error";

function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error("VITE_GOOGLE_CLIENT_ID is missing"));
      return;
    }
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          response.access_token ? resolve(response.access_token) : reject(new Error("No token"));
        },
      });
      client.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}

export function useCalendar() {
  const [isLogged, setIsLogged] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus>("idle");

  const resetCalendar = useCallback(() => {
    setIsLogged(false);
    setCalendarStatus("idle");
  }, []);

  const logToCalendar = useCallback(async (mealName: string, mealTime: string) => {
    setCalendarStatus("loading");
    try {
      const token = await getAccessToken();
      const now = new Date();
      const event = {
        summary: `🍴 ${mealName} (${mealTime})`,
        description: `Bữa ${mealTime} được gợi ý từ Hôm Nay Ăn Gì`,
        start: { dateTime: now.toISOString() },
        end: { dateTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString() },
      };
      const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error("Calendar API error");
      setCalendarStatus("success");
      setIsLogged(true);
    } catch (err) {
      console.error(err);
      setCalendarStatus("error");
    }
  }, []);

  return { isLogged, calendarStatus, logToCalendar, resetCalendar };
}
