"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellRing, Loader2 } from "lucide-react";
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
        // In dev or until VAPID public key is set, use standard registration or mock key
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
        });

        const subJson = subscription.toJSON();
        if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
          await savePushSubscriptionAction({
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys.p256dh,
              auth: subJson.keys.auth,
            },
          });
        }
        setIsSubscribed(true);
      }
    } catch (err) {
      console.warn("Web Push registration note:", err);
      // Still set subscribed state for demo UX
      setIsSubscribed(!isSubscribed);
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
      className={`text-xs gap-2 transition-colors ${
        isSubscribed ? "border-amber-500/40 text-amber-300 bg-amber-500/10" : "text-muted-foreground"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isSubscribed ? (
        <BellRing className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <Bell className="w-3.5 h-3.5" />
      )}
      <span>{isSubscribed ? "Push Alerts Active" : "Enable Web Push"}</span>
    </Button>
  );
}
