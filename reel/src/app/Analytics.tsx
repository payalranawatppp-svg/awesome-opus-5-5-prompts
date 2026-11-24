/** Analytics, on the pixel-matched shell (842 px viewport, as the analytics reference was captured). The page body
 * comes from reelfx/AnalyticsDemo (one consistent demo dataset); this wraps it in the real header and sidebar. */
import React from "react";
import { AppFrame, AMANDA, ChatFab, VP, Vp } from "./AppShell";
import { Page, PAGE_H } from "../reelfx/AnalyticsDemo";

export const ANALYTICS_H = PAGE_H;
export const AnalyticsPage: React.FC<{ vh?: Vp; scroll?: number; chrome?: boolean; hover?: string | null }> = ({ vh = 842, scroll = 0, chrome = true, hover = null }) => (
  <AppFrame active="Analytics" group="Referrals" title="Analytics" clinic="St. Andrew’s Family Dental" user={AMANDA} vh={vh} scroll={scroll} fixed={chrome && <ChatFab x={1806} y={vh - 87} />}>
    <div style={{ position: "absolute", left: 0, top: -VP[vh].head + 13, width: 1920 }}><Page hover={hover} bare /></div>
  </AppFrame>
);
