"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellRinging, SpinnerGap } from "@phosphor-icons/react";
import { savePushSubscriptionAction } from "@/app/actions/dashboard";

export function PushNotificationToggle() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      // Register Service Worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          return registration.pushManager.getSubscription();
        })
        .then((subscription) => {
          setIsSubscribed(Boolean(subscription));
        })
        .catch(() => {});
    }
  }, []);

  const handleToggle = async () => {
    if (!isSupported) return;
    setLoading(true);

    try {
      if (isSubscribed) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
        }
        setIsSubscribed(false);
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert("Please enable notification permissions in your browser to receive paper updates.");
          setLoading(false);
          return;
        }

        const reg = await navigator.serviceWorker.ready;
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        let sub = await reg.pushManager.getSubscription();

        if (!sub && vapidPublicKey) {
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidPublicKey,
          });
        }

        if (sub) {
          const rawSub = sub.toJSON();
          if (rawSub.endpoint && rawSub.keys?.p256dh && rawSub.keys?.auth) {
            await savePushSubscriptionAction({
              endpoint: rawSub.endpoint,
              keys: {
                p256dh: rawSub.keys.p256dh,
                auth: rawSub.keys.auth,
              },
            });
          }
          setIsSubscribed(true);
        } else {
          setIsSubscribed(true);
        }
      }
    } catch (err) {
      console.error("[Push] Toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={`gap-1.5 text-xs rounded-xl ${
        isSubscribed ? "border-[var(--brand)]/40 text-[var(--brand)]" : "text-[var(--muted)]"
      }`}
    >
      {loading ? (
        <SpinnerGap size={14} className="animate-spin" />
      ) : isSubscribed ? (
        <BellRinging size={14} weight="fill" className="text-[var(--brand)]" />
      ) : (
        <Bell size={14} weight="regular" />
      )}
      <span>{isSubscribed ? "Alerts On" : "Enable Alerts"}</span>
    </Button>
  );
}
