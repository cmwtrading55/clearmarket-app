"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet";
import { calcOracleDiscount } from "@/lib/oracle";
import { mockBatches } from "@/data/mockBatches";
import type { LaunchpadListing } from "@/lib/types";
import StepIndicator from "./StepIndicator";
import OracleScorePanel from "./OracleScorePanel";
import { ArrowLeft, ArrowRight, Rocket, Loader2 } from "lucide-react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

type FormData = Partial<LaunchpadListing>;

const GROW_METHODS = ["Soil", "Hydroponic", "Aeroponic", "Aquaponic", "Coco Coir"];
const LIGHTING_OPTIONS = ["LED", "HPS", "CMH", "Natural Sunlight", "Mixed"];
const GROWER_TYPES: LaunchpadListing["grower_type"][] = ["indoor", "outdoor", "greenhouse"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border border-border focus:border-primary focus:outline-none transition-colors";
const selectCls = inputCls;

export default function SubmissionForm() {
  const router = useRouter();
  const { address, connected } = useWallet();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    grower_wallet: address || "",
    grower_name: "",
    grower_location: "",
    grower_type: null,
    strain: "",
    description: "",
    hero_image: "",
    region: "",
    yield_kg: null,
    thc_percent: null,
    cbd_percent: null,
    harvest_date: null,
    funding_target: null,
    price_per_token: null,
    token_symbol: "",
    grow_method: "",
    lighting: "",
    nutrients: "",
    facility_certification: "",
    lab_testing_provider: "",
    expected_terpene_profile: "",
    insurance_coverage: false,
    contracted_buyer: false,
    contracted_buyer_name: "",
  });

  const set = (key: keyof FormData, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const oracle = useMemo(
    () => calcOracleDiscount(form, mockBatches, form.grower_wallet || ""),
    [form]
  );

  const handleSubmit = async () => {
    if (!connected || !address) {
      setError("Connect your wallet first.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-listing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ ...form, grower_wallet: address }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Submission failed");
        setSubmitting(false);
        return;
      }
      router.push(`/launchpad/${result.listing.id}`);
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Form area */}
      <div className="flex-1 space-y-6">
        <StepIndicator current={step} />

        <div className="bg-card-bg border border-border rounded-xl p-5 space-y-5">
          {/* Step 1: Grower Info */}
          {step === 0 && (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                Grower Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Wallet Address">
                  <input
                    className={inputCls}
                    value={address || form.grower_wallet || ""}
                    disabled
                    placeholder="Connect wallet"
                  />
                </Field>
                <Field label="Grower Name">
                  <input
                    className={inputCls}
                    value={form.grower_name || ""}
                    onChange={(e) => set("grower_name", e.target.value)}
                    placeholder="e.g. Green Valley Farms"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={form.grower_location || ""}
                    onChange={(e) => set("grower_location", e.target.value)}
                    placeholder="e.g. California, USA"
                  />
                </Field>
                <Field label="Grow Type">
                  <select
                    className={selectCls}
                    value={form.grower_type || ""}
                    onChange={(e) =>
                      set(
                        "grower_type",
                        (e.target.value as LaunchpadListing["grower_type"]) ||
                          null
                      )
                    }
                  >
                    <option value="">Select...</option>
                    {GROWER_TYPES.map((t) => (
                      <option key={t} value={t!}>
                        {t!.charAt(0).toUpperCase() + t!.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </>
          )}

          {/* Step 2: Crop Details */}
          {step === 1 && (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                Crop Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Strain *">
                  <input
                    className={inputCls}
                    value={form.strain || ""}
                    onChange={(e) => set("strain", e.target.value)}
                    placeholder="e.g. Blue Dream"
                  />
                </Field>
                <Field label="Region">
                  <input
                    className={inputCls}
                    value={form.region || ""}
                    onChange={(e) => set("region", e.target.value)}
                    placeholder="e.g. Northern California"
                  />
                </Field>
                <Field label="THC %">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.thc_percent ?? ""}
                    onChange={(e) =>
                      set("thc_percent", e.target.value ? +e.target.value : null)
                    }
                    placeholder="e.g. 21.4"
                  />
                </Field>
                <Field label="CBD %">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.cbd_percent ?? ""}
                    onChange={(e) =>
                      set("cbd_percent", e.target.value ? +e.target.value : null)
                    }
                    placeholder="e.g. 0.8"
                  />
                </Field>
                <Field label="Yield (kg)">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.yield_kg ?? ""}
                    onChange={(e) =>
                      set("yield_kg", e.target.value ? +e.target.value : null)
                    }
                    placeholder="e.g. 450"
                  />
                </Field>
                <Field label="Harvest Date">
                  <input
                    type="date"
                    className={inputCls}
                    value={form.harvest_date || ""}
                    onChange={(e) => set("harvest_date", e.target.value)}
                  />
                </Field>
                <Field label="Grow Method">
                  <select
                    className={selectCls}
                    value={form.grow_method || ""}
                    onChange={(e) => set("grow_method", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {GROW_METHODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Lighting">
                  <select
                    className={selectCls}
                    value={form.lighting || ""}
                    onChange={(e) => set("lighting", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {LIGHTING_OPTIONS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Nutrients">
                  <input
                    className={inputCls}
                    value={form.nutrients || ""}
                    onChange={(e) => set("nutrients", e.target.value)}
                    placeholder="e.g. Organic living soil"
                  />
                </Field>
                <Field label="Hero Image URL">
                  <input
                    className={inputCls}
                    value={form.hero_image || ""}
                    onChange={(e) => set("hero_image", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  className={`${inputCls} min-h-[80px] resize-y`}
                  value={form.description || ""}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the crop, cultivation methods, and expected outcomes..."
                  rows={3}
                />
              </Field>
            </>
          )}

          {/* Step 3: Financials & Contracts */}
          {step === 2 && (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                Financials & Contracts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Funding Target (USDC)">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.funding_target ?? ""}
                    onChange={(e) =>
                      set(
                        "funding_target",
                        e.target.value ? +e.target.value : null
                      )
                    }
                    placeholder="e.g. 250000"
                  />
                </Field>
                <Field label="Price Per Token (USDC)">
                  <input
                    type="number"
                    step="0.01"
                    className={inputCls}
                    value={form.price_per_token ?? ""}
                    onChange={(e) =>
                      set(
                        "price_per_token",
                        e.target.value ? +e.target.value : null
                      )
                    }
                    placeholder="e.g. 3.24"
                  />
                </Field>
                <Field label="Token Symbol">
                  <input
                    className={inputCls}
                    value={form.token_symbol || ""}
                    onChange={(e) =>
                      set("token_symbol", e.target.value.toUpperCase())
                    }
                    placeholder="e.g. BDREAM"
                    maxLength={8}
                  />
                </Field>
                <Field label="Facility Certification">
                  <input
                    className={inputCls}
                    value={form.facility_certification || ""}
                    onChange={(e) =>
                      set("facility_certification", e.target.value)
                    }
                    placeholder="e.g. GACP, EU-GMP"
                  />
                </Field>
                <Field label="Lab Testing Provider">
                  <input
                    className={inputCls}
                    value={form.lab_testing_provider || ""}
                    onChange={(e) =>
                      set("lab_testing_provider", e.target.value)
                    }
                    placeholder="e.g. SC Labs"
                  />
                </Field>
                <Field label="Terpene Profile">
                  <input
                    className={inputCls}
                    value={form.expected_terpene_profile || ""}
                    onChange={(e) =>
                      set("expected_terpene_profile", e.target.value)
                    }
                    placeholder="e.g. Myrcene, Limonene, Pinene"
                  />
                </Field>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.insurance_coverage || false}
                    onChange={(e) =>
                      set("insurance_coverage", e.target.checked)
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <div>
                    <p className="text-sm text-foreground">Insurance Coverage</p>
                    <p className="text-xs text-muted">
                      Crop is insured against loss (+10 completeness pts)
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.contracted_buyer || false}
                    onChange={(e) =>
                      set("contracted_buyer", e.target.checked)
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <div>
                    <p className="text-sm text-foreground">Contracted Buyer</p>
                    <p className="text-xs text-muted">
                      Pre-arranged buyer for harvest (+15–25 bonus)
                    </p>
                  </div>
                </label>

                {form.contracted_buyer && (
                  <Field label="Buyer Name">
                    <input
                      className={inputCls}
                      value={form.contracted_buyer_name || ""}
                      onChange={(e) =>
                        set("contracted_buyer_name", e.target.value)
                      }
                      placeholder="e.g. MedPharm Holdings"
                    />
                  </Field>
                )}
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 3 && (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                Review & Submit
              </h3>
              <div className="space-y-4">
                <ReviewRow label="Strain" value={form.strain} />
                <ReviewRow label="Grower" value={form.grower_name} />
                <ReviewRow label="Location" value={form.grower_location} />
                <ReviewRow label="Region" value={form.region} />
                <ReviewRow
                  label="Yield"
                  value={form.yield_kg ? `${form.yield_kg} kg` : undefined}
                />
                <ReviewRow label="THC / CBD" value={
                  form.thc_percent != null || form.cbd_percent != null
                    ? `${form.thc_percent ?? "–"}% / ${form.cbd_percent ?? "–"}%`
                    : undefined
                } />
                <ReviewRow
                  label="Funding Target"
                  value={
                    form.funding_target
                      ? `$${form.funding_target.toLocaleString()}`
                      : undefined
                  }
                />
                <ReviewRow
                  label="Token"
                  value={
                    form.token_symbol && form.price_per_token
                      ? `${form.token_symbol} @ $${form.price_per_token}`
                      : form.token_symbol || undefined
                  }
                />
                <ReviewRow label="Harvest Date" value={form.harvest_date} />
                <ReviewRow label="Grow Method" value={form.grow_method} />
                <ReviewRow
                  label="Insurance"
                  value={form.insurance_coverage ? "Yes" : "No"}
                />
                <ReviewRow
                  label="Contracted Buyer"
                  value={
                    form.contracted_buyer
                      ? form.contracted_buyer_name || "Yes (unnamed)"
                      : "None"
                  }
                />

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Oracle Discount
                    </span>
                    <span className="text-lg font-bold font-mono text-primary">
                      {oracle.discount.toFixed(1)}% (Grade {oracle.riskGrade})
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-sell bg-sell/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-lg border border-border text-foreground hover:border-primary/40 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !connected}
              className="flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Next
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.strain}
              className="flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Rocket size={14} />
              )}
              {submitting ? "Submitting..." : "Submit Listing"}
            </button>
          )}
        </div>
      </div>

      {/* Oracle sidebar */}
      <div className="lg:w-72 xl:w-80 shrink-0">
        <div className="lg:sticky lg:top-20">
          <OracleScorePanel oracle={oracle} />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-foreground font-medium">
        {value || "—"}
      </span>
    </div>
  );
}
