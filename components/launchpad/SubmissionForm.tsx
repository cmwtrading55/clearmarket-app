"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet";
import { calcOracleDiscount, COMMODITY_CONFIGS } from "@/lib/oracle";
import type { CommodityType } from "@/lib/oracle";
import { mockBatches } from "@/data/mockBatches";
import type { LaunchpadListing } from "@/lib/types";
import StepIndicator from "./StepIndicator";
import OracleScorePanel from "./OracleScorePanel";
import { ArrowLeft, ArrowRight, Rocket, Loader2, Wheat, Leaf } from "lucide-react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

type FormData = Partial<LaunchpadListing> & Record<string, unknown>;

const GROW_METHODS = ["Soil", "Hydroponic", "Aeroponic", "Aquaponic", "Coco Coir"];
const LIGHTING_OPTIONS = ["LED", "HPS", "CMH", "Natural Sunlight", "Mixed"];
const GROWER_TYPES: LaunchpadListing["grower_type"][] = ["indoor", "outdoor", "greenhouse"];

const SOYBEAN_VARIETIES = [
  "Roundup Ready 2 Xtend",
  "Enlist E3",
  "Non-GMO Conventional",
  "Organic",
  "High Oleic",
  "High Protein",
  "Natto / Food Grade",
];

const USDA_GRADES = ["U.S. No. 1", "U.S. No. 2", "U.S. No. 3", "U.S. No. 4", "U.S. Sample Grade"];
const DELIVERY_TERMS_OPTIONS = ["FOB Farm", "FOB Elevator", "Delivered", "CIF Port", "Ex-Works"];

const COMMODITY_OPTIONS: { value: CommodityType; label: string; icon: React.ReactNode }[] = [
  { value: "cannabis", label: "Cannabis", icon: <Leaf size={16} /> },
  { value: "soybeans", label: "Soybeans", icon: <Wheat size={16} /> },
];

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
  const [commodityType, setCommodityType] = useState<CommodityType>("cannabis");

  const [form, setForm] = useState<FormData>({
    commodity_type: "cannabis",
    grower_wallet: address || "",
    grower_name: "",
    grower_location: "",
    grower_type: null,
    // Cannabis
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
    // Soybeans
    variety: "",
    yield_tonnes: null,
    protein_content: null,
    moisture_percent: null,
    oil_content: null,
    usda_grade: "",
    storage_facility: "",
    delivery_terms: "",
    farm_certification: "",
  });

  const set = (key: string, val: unknown) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleCommodityChange = (ct: CommodityType) => {
    setCommodityType(ct);
    setForm((prev) => ({ ...prev, commodity_type: ct }));
    setStep(0);
  };

  const oracle = useMemo(
    () => calcOracleDiscount(form, mockBatches, form.grower_wallet as string || "", commodityType),
    [form, commodityType]
  );

  const config = COMMODITY_CONFIGS[commodityType];

  const stepLabels = commodityType === "cannabis"
    ? ["Grower Info", "Crop Details", "Financials", "Review"]
    : ["Grower Info", "Crop Details", "Financials", "Review"];

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
        body: JSON.stringify({ ...form, grower_wallet: address, commodity_type: commodityType }),
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

  // Primary name field label changes per commodity
  const primaryNameLabel = commodityType === "cannabis" ? "Strain *" : "Variety *";
  const primaryNameValue = commodityType === "cannabis" ? (form.strain || "") : (form.variety || "");
  const primaryNameKey = commodityType === "cannabis" ? "strain" : "variety";
  const primaryNamePlaceholder = commodityType === "cannabis" ? "e.g. Blue Dream" : "e.g. Roundup Ready 2 Xtend";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Form area */}
      <div className="flex-1 space-y-6">
        {/* Commodity selector */}
        <div className="flex gap-2">
          {COMMODITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleCommodityChange(opt.value)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-colors ${
                commodityType === opt.value
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "border-border text-muted hover:text-foreground hover:border-primary/20"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        <StepIndicator current={step} steps={stepLabels} />

        <div className="bg-card-bg border border-border rounded-xl p-5 space-y-5">
          {/* Step 1: Grower Info (shared) */}
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
                    placeholder={commodityType === "cannabis" ? "e.g. Green Valley Farms" : "e.g. Heartland Soy Co."}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={form.grower_location || ""}
                    onChange={(e) => set("grower_location", e.target.value)}
                    placeholder={commodityType === "cannabis" ? "e.g. California, USA" : "e.g. Iowa, USA"}
                  />
                </Field>
                {commodityType === "cannabis" && (
                  <Field label="Grow Type">
                    <select
                      className={selectCls}
                      value={form.grower_type || ""}
                      onChange={(e) =>
                        set(
                          "grower_type",
                          (e.target.value as LaunchpadListing["grower_type"]) || null
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
                )}
                {commodityType === "soybeans" && (
                  <Field label="Farm Certification">
                    <input
                      className={inputCls}
                      value={(form.farm_certification as string) || ""}
                      onChange={(e) => set("farm_certification", e.target.value)}
                      placeholder="e.g. USDA Organic, Non-GMO Project"
                    />
                  </Field>
                )}
              </div>
            </>
          )}

          {/* Step 2: Crop Details (commodity-specific) */}
          {step === 1 && commodityType === "cannabis" && (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                Cannabis Crop Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={primaryNameLabel}>
                  <input
                    className={inputCls}
                    value={primaryNameValue}
                    onChange={(e) => set(primaryNameKey, e.target.value)}
                    placeholder={primaryNamePlaceholder}
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
                    onChange={(e) => set("thc_percent", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 21.4"
                  />
                </Field>
                <Field label="CBD %">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.cbd_percent ?? ""}
                    onChange={(e) => set("cbd_percent", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 0.8"
                  />
                </Field>
                <Field label="Yield (kg)">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.yield_kg ?? ""}
                    onChange={(e) => set("yield_kg", e.target.value ? +e.target.value : null)}
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
                      <option key={m} value={m}>{m}</option>
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
                      <option key={l} value={l}>{l}</option>
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

          {step === 1 && commodityType === "soybeans" && (
            <>
              <h3 className="text-sm font-semibold text-foreground">
                Soybean Crop Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Variety *">
                  <select
                    className={selectCls}
                    value={(form.variety as string) || ""}
                    onChange={(e) => set("variety", e.target.value)}
                  >
                    <option value="">Select variety...</option>
                    {SOYBEAN_VARIETIES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Region">
                  <input
                    className={inputCls}
                    value={form.region || ""}
                    onChange={(e) => set("region", e.target.value)}
                    placeholder="e.g. Iowa Corn Belt"
                  />
                </Field>
                <Field label="Protein Content (%)">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.protein_content ?? ""}
                    onChange={(e) => set("protein_content", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 36.5"
                  />
                </Field>
                <Field label="Moisture (%)">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.moisture_percent ?? ""}
                    onChange={(e) => set("moisture_percent", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 13.0"
                  />
                </Field>
                <Field label="Oil Content (%)">
                  <input
                    type="number"
                    step="0.1"
                    className={inputCls}
                    value={form.oil_content ?? ""}
                    onChange={(e) => set("oil_content", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 19.2"
                  />
                </Field>
                <Field label="USDA Grade">
                  <select
                    className={selectCls}
                    value={(form.usda_grade as string) || ""}
                    onChange={(e) => set("usda_grade", e.target.value)}
                  >
                    <option value="">Select grade...</option>
                    {USDA_GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Yield (tonnes)">
                  <input
                    type="number"
                    className={inputCls}
                    value={form.yield_tonnes ?? ""}
                    onChange={(e) => set("yield_tonnes", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 500"
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
                <Field label="Storage Facility">
                  <input
                    className={inputCls}
                    value={(form.storage_facility as string) || ""}
                    onChange={(e) => set("storage_facility", e.target.value)}
                    placeholder="e.g. ADM Decatur Elevator"
                  />
                </Field>
                <Field label="Delivery Terms">
                  <select
                    className={selectCls}
                    value={(form.delivery_terms as string) || ""}
                    onChange={(e) => set("delivery_terms", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {DELIVERY_TERMS_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
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
                  placeholder="Describe the crop, soil conditions, expected quality characteristics..."
                  rows={3}
                />
              </Field>
            </>
          )}

          {/* Step 3: Financials & Contracts (shared) */}
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
                    onChange={(e) => set("funding_target", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 250000"
                  />
                </Field>
                <Field label="Price Per Token (USDC)">
                  <input
                    type="number"
                    step="0.01"
                    className={inputCls}
                    value={form.price_per_token ?? ""}
                    onChange={(e) => set("price_per_token", e.target.value ? +e.target.value : null)}
                    placeholder="e.g. 3.24"
                  />
                </Field>
                <Field label="Token Symbol">
                  <input
                    className={inputCls}
                    value={form.token_symbol || ""}
                    onChange={(e) => set("token_symbol", e.target.value.toUpperCase())}
                    placeholder={commodityType === "cannabis" ? "e.g. BDREAM" : "e.g. SOYRR"}
                    maxLength={8}
                  />
                </Field>
                {commodityType === "cannabis" && (
                  <>
                    <Field label="Facility Certification">
                      <input
                        className={inputCls}
                        value={form.facility_certification || ""}
                        onChange={(e) => set("facility_certification", e.target.value)}
                        placeholder="e.g. GACP, EU-GMP"
                      />
                    </Field>
                    <Field label="Lab Testing Provider">
                      <input
                        className={inputCls}
                        value={form.lab_testing_provider || ""}
                        onChange={(e) => set("lab_testing_provider", e.target.value)}
                        placeholder="e.g. SC Labs"
                      />
                    </Field>
                    <Field label="Terpene Profile">
                      <input
                        className={inputCls}
                        value={form.expected_terpene_profile || ""}
                        onChange={(e) => set("expected_terpene_profile", e.target.value)}
                        placeholder="e.g. Myrcene, Limonene, Pinene"
                      />
                    </Field>
                  </>
                )}
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.insurance_coverage || false}
                    onChange={(e) => set("insurance_coverage", e.target.checked)}
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
                    onChange={(e) => set("contracted_buyer", e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <div>
                    <p className="text-sm text-foreground">Contracted Buyer</p>
                    <p className="text-xs text-muted">
                      Pre-arranged buyer for harvest (+15-25 bonus)
                    </p>
                  </div>
                </label>

                {form.contracted_buyer && (
                  <Field label="Buyer Name">
                    <input
                      className={inputCls}
                      value={form.contracted_buyer_name || ""}
                      onChange={(e) => set("contracted_buyer_name", e.target.value)}
                      placeholder={commodityType === "cannabis" ? "e.g. MedPharm Holdings" : "e.g. Cargill, ADM"}
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
                <ReviewRow label="Commodity" value={config.label} />
                {commodityType === "cannabis" ? (
                  <>
                    <ReviewRow label="Strain" value={form.strain} />
                    <ReviewRow label="THC / CBD" value={
                      form.thc_percent != null || form.cbd_percent != null
                        ? `${form.thc_percent ?? "–"}% / ${form.cbd_percent ?? "–"}%`
                        : undefined
                    } />
                    <ReviewRow label="Yield" value={form.yield_kg ? `${form.yield_kg} kg` : undefined} />
                    <ReviewRow label="Grow Method" value={form.grow_method} />
                  </>
                ) : (
                  <>
                    <ReviewRow label="Variety" value={form.variety} />
                    <ReviewRow label="Protein / Oil" value={
                      form.protein_content != null || form.oil_content != null
                        ? `${form.protein_content ?? "–"}% / ${form.oil_content ?? "–"}%`
                        : undefined
                    } />
                    <ReviewRow label="Moisture" value={form.moisture_percent ? `${form.moisture_percent}%` : undefined} />
                    <ReviewRow label="USDA Grade" value={form.usda_grade as string} />
                    <ReviewRow label="Yield" value={form.yield_tonnes ? `${form.yield_tonnes} tonnes` : undefined} />
                    <ReviewRow label="Delivery Terms" value={form.delivery_terms as string} />
                    <ReviewRow label="Storage" value={form.storage_facility as string} />
                  </>
                )}
                <ReviewRow label="Grower" value={form.grower_name} />
                <ReviewRow label="Location" value={form.grower_location} />
                <ReviewRow label="Region" value={form.region} />
                <ReviewRow
                  label="Funding Target"
                  value={form.funding_target ? `$${form.funding_target.toLocaleString()}` : undefined}
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
              disabled={submitting || (commodityType === "cannabis" ? !form.strain : !form.variety)}
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
