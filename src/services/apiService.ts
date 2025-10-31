import { ApiResponse } from "@/types/api";

const API_URL = "https://staging.qikpod.com/pubsub/subscribe";
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2wiOiJhZG1pbiIsImV4cCI6MTkwMDY2MDExOX0.m9Rrmvbo22sJpWgTVynJLDIXFxOfym48F-kGy-wSKqQ";

export const fetchLatestEvent = async (): Promise<ApiResponse | null> => {
  try {
    const url = new URL(API_URL);
    url.searchParams.append("topic", "TV_EVENT");
    url.searchParams.append("num_records", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};
