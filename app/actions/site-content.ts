"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SiteContent {
  bioEn: string;
  bioSi: string;
  photoUrl: string;
  statementEn: string;
  statementSi: string;
  achievementsEn: string;
  achievementsSi: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
}

export async function getSiteContentAction(): Promise<SiteContent> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_content")
    .select("key, value_en, value_si")
    .order("key");

  const map: Record<string, { en: string; si: string }> = {};
  (data || []).forEach((row: { key: string; value_en: string; value_si: string }) => {
    map[row.key] = { en: row.value_en || "", si: row.value_si || "" };
  });

  return {
    bioEn: map["bio"]?.en || "Specialist in O/L Mathematics & A/L Combined Mathematics in Kurunegala.",
    bioSi: map["bio"]?.si || "කුරුණෑගල දිස්ත්‍රික්කයේ සාමාන්‍ය පෙළ සහ උසස් පෙළ සංයුක්ත ගණිතය විශේෂඥ ගුරුතුමන්.",
    photoUrl: map["photo"]?.en || "/images/sir-malinga.jpg",
    statementEn: map["statement"]?.en || "Mathematics is not a test of memory; it is a discipline of structured thinking.",
    statementSi: map["statement"]?.si || "ගණිතය යනු මතකය පරීක්ෂා කිරීමක් නොවේ; එය ව්‍යුහගත චින්තනයේ විනයකි.",
    achievementsEn: map["achievements"]?.en || "",
    achievementsSi: map["achievements"]?.si || "",
    contactPhone: map["contact_phone"]?.en || "",
    contactWhatsapp: map["contact_whatsapp"]?.en || "",
    contactAddress: map["contact_address"]?.en || "Kurunegala, Sri Lanka",
  };
}

export async function updateSiteContentAction(formData: FormData) {
  const supabase = createAdminClient();

  const entries = [
    { key: "bio", en: String(formData.get("bioEn") || ""), si: String(formData.get("bioSi") || "") },
    { key: "photo", en: String(formData.get("photoUrl") || "/images/sir-malinga.jpg"), si: String(formData.get("photoUrl") || "") },
    { key: "statement", en: String(formData.get("statementEn") || ""), si: String(formData.get("statementSi") || "") },
    { key: "achievements", en: String(formData.get("achievementsEn") || ""), si: String(formData.get("achievementsSi") || "") },
    { key: "contact_phone", en: String(formData.get("contactPhone") || ""), si: String(formData.get("contactPhone") || "") },
    { key: "contact_whatsapp", en: String(formData.get("contactWhatsapp") || ""), si: String(formData.get("contactWhatsapp") || "") },
    { key: "contact_address", en: String(formData.get("contactAddress") || ""), si: String(formData.get("contactAddress") || "") },
  ];

  for (const item of entries) {
    await supabase.from("site_content").upsert(
      {
        key: item.key,
        value_en: item.en,
        value_si: item.si,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/content");
  return { success: true };
}
