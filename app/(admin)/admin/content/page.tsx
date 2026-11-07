import React from "react";
import { getSiteContentAction, updateSiteContentAction } from "@/app/actions/site-content";
import { Glass } from "@/components/ui/glass";
import { Button } from "@/components/ui/button";

export default async function AdminSiteContentPage() {
  const content = await getSiteContentAction();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Site Content &amp; Media</h1>
        <p className="text-sm text-[var(--muted)]">
          Manage landing page statements, biographical notes, contact channels, and photos.
        </p>
      </div>

      <Glass tint="subtle" className="p-6 sm:p-8 rounded-2xl border border-[var(--border)]">
        <form
          action={async (formData: FormData) => {
            "use server";
            await updateSiteContentAction(formData);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-[var(--text)]">Teaching Statement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">English</label>
                <textarea
                  name="statementEn"
                  defaultValue={content.statementEn}
                  rows={3}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Sinhala (සිංහල)</label>
                <textarea
                  name="statementSi"
                  defaultValue={content.statementSi}
                  rows={3}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)]">Educator Bio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">English</label>
                <textarea
                  name="bioEn"
                  defaultValue={content.bioEn}
                  rows={3}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Sinhala (සිංහල)</label>
                <textarea
                  name="bioSi"
                  defaultValue={content.bioSi}
                  rows={3}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border)]">
            <h2 className="text-base font-semibold text-[var(--text)]">Official Photo &amp; Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Photo URL / Path</label>
                <input
                  type="text"
                  name="photoUrl"
                  defaultValue={content.photoUrl}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Physical Address</label>
                <input
                  type="text"
                  name="contactAddress"
                  defaultValue={content.contactAddress}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  defaultValue={content.contactPhone}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">WhatsApp Support Number</label>
                <input
                  type="text"
                  name="contactWhatsapp"
                  defaultValue={content.contactWhatsapp}
                  className="w-full rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary">
              Save Content Changes
            </Button>
          </div>
        </form>
      </Glass>
    </div>
  );
}
