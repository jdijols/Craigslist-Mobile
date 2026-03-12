import { Bed, Bath, Square, Calendar, Home, Shirt, Car } from "lucide-react";
import type { PostCategory } from "../../ui/cards/types";
import {
  HOUSING_GROUPS,
  HOUSING_GROUP_LABELS,
  formatAttributeValue,
  getHousingAttributeLabel,
  FOR_SALE_GROUPS,
  FOR_SALE_GROUP_LABELS,
  formatForSaleAttributeValue,
  getForSaleAttributeLabel,
  JOBS_GROUPS,
  JOBS_GROUP_LABELS,
  formatJobsAttributeValue,
  getJobsAttributeLabel,
  GIGS_GROUPS,
  GIGS_GROUP_LABELS,
  formatGigsAttributeValue,
  RESUMES_GROUPS,
  RESUMES_GROUP_LABELS,
  formatResumesAttributeValue,
  SERVICES_GROUPS,
  SERVICES_GROUP_LABELS,
  formatServicesAttributeValue,
  COMMUNITY_GROUPS,
  COMMUNITY_GROUP_LABELS,
  formatCommunityAttributeValue,
  type HousingAttributeKey,
  type ForSaleAttributeKey,
  type JobsAttributeKey,
  type GigsAttributeKey,
  type ResumesAttributeKey,
  type ServicesAttributeKey,
  type CommunityAttributeKey,
} from "../../../data/listingAttributes";

const HOUSING_BOOLEAN_DISPLAY_LABELS: Partial<Record<HousingAttributeKey, string>> = {
  cats_ok: "cats OK",
  dogs_ok: "dogs OK",
  no_smoking: "no smoking",
  air_conditioning: "AC",
  wheelchair_accessible: "wheelchair accessible",
  ev_charging: "EV charging",
  furnished: "furnished",
  no_application_fee: "no application fee",
  no_broker_fee: "no broker fee",
  private_bath: "private bath",
  private_room: "private room",
  posted_today: "posted today",
};

const FOR_SALE_BOOLEAN_DISPLAY_LABELS: Partial<Record<ForSaleAttributeKey, string>> = {
  posted_today: "posted today",
  delivery_available: "delivery available",
  cryptocurrency_ok: "cryptocurrency ok",
};

const HOUSING_ICONS: Partial<Record<HousingAttributeKey, React.ComponentType<{ className?: string; strokeWidth?: number }>>> = {
  bedrooms: Bed,
  bathrooms: Bath,
  area: Square,
  move_in_date: Calendar,
  availability: Calendar,
  housing_type: Home,
  laundry: Shirt,
  parking: Car,
};

const JOBS_BOOLEAN_DISPLAY_LABELS: Partial<Record<JobsAttributeKey, string>> = {
  internship: "internship",
  non_profit_organization: "non-profit organization",
  telecommuting_ok: "telecommuting ok",
  posted_today: "posted today",
};

interface ListingAttributesProps {
  category: PostCategory;
  attributes: Record<string, string | number | boolean>;
}

export function ListingAttributes({ category, attributes }: ListingAttributesProps) {
  if (!attributes || Object.keys(attributes).length === 0) return null;
  if (category === "housing") return <HousingAttributes attributes={attributes} />;
  if (category === "for-sale") return <ForSaleAttributes attributes={attributes} />;
  if (category === "jobs") return <JobsAttributes attributes={attributes} />;
  if (category === "gigs") return <GigsAttributes attributes={attributes} />;
  if (category === "resumes") return <ResumesAttributes attributes={attributes} />;
  if (category === "services") return <ServicesAttributes attributes={attributes} />;
  if (category === "community") return <CommunityAttributes attributes={attributes} />;
  return null;
}

function getGroupItems<T extends string>(
  attributes: Record<string, string | number | boolean>,
  groupKeys: readonly string[]
): { key: T; value: string | number | true }[] {
  return groupKeys
    .map((key) => {
      const value = attributes[key];
      if (value === undefined) return null;
      if (value === false) return null;
      return { key: key as T, value: value as string | number | true };
    })
    .filter((x): x is { key: T; value: string | number | true } => x !== null);
}

function HousingAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const getHousingGroupItems = (groupKeys: readonly string[]) =>
    getGroupItems<HousingAttributeKey>(attributes, groupKeys);
  const sizeItems = getHousingGroupItems(HOUSING_GROUPS.size);
  const leaseItems = getHousingGroupItems(HOUSING_GROUPS.lease);
  const petItems = getHousingGroupItems(HOUSING_GROUPS.pets);
  const amenityItems = getHousingGroupItems(HOUSING_GROUPS.amenities);
  const optionsItems = getHousingGroupItems(HOUSING_GROUPS.options);

  const hasAny = sizeItems.length > 0 || leaseItems.length > 0 || petItems.length > 0 || amenityItems.length > 0 || optionsItems.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        {sizeItems.length > 0 && (
          <AttributeSection label={HOUSING_GROUP_LABELS.size}>
            <div className="flex flex-wrap gap-2">
              {sizeItems.map(({ key, value }) => {
                const Icon = HOUSING_ICONS[key as keyof typeof HOUSING_ICONS];
                const formatted = formatAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    {Icon && <Icon className="h-4 w-4 text-cl-text-muted" strokeWidth={2} />}
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {leaseItems.length > 0 && (
          <AttributeSection label={HOUSING_GROUP_LABELS.lease}>
            <div className="flex flex-wrap gap-2">
              {leaseItems.map(({ key, value }) => {
                const Icon = HOUSING_ICONS[key as keyof typeof HOUSING_ICONS];
                const formatted = formatAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    {Icon && <Icon className="h-4 w-4 text-cl-text-muted" strokeWidth={2} />}
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {petItems.length > 0 && (
          <AttributeSection label={HOUSING_GROUP_LABELS.pets}>
            <div className="flex flex-wrap gap-2">
              {petItems.map(({ key }) => {
                const label = key === "cats_ok" ? "cats OK" : "dogs OK";
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{label}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {amenityItems.length > 0 && (
          <AttributeSection label={HOUSING_GROUP_LABELS.amenities}>
            <div className="flex flex-wrap gap-2">
              {amenityItems.map(({ key, value }) => {
                const isBool = value === true;
                const displayText = isBool
                  ? (HOUSING_BOOLEAN_DISPLAY_LABELS[key as keyof typeof HOUSING_BOOLEAN_DISPLAY_LABELS] ?? getHousingAttributeLabel(key))
                  : formatAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{displayText}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {optionsItems.length > 0 && (
          <AttributeSection label={HOUSING_GROUP_LABELS.options}>
            <div className="flex flex-wrap gap-2">
              {optionsItems.map(({ key }) => {
                const label = HOUSING_BOOLEAN_DISPLAY_LABELS[key as keyof typeof HOUSING_BOOLEAN_DISPLAY_LABELS] ?? getHousingAttributeLabel(key);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{label}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}
      </div>
    </div>
  );
}

function ForSaleAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const getForSaleGroupItems = (groupKeys: readonly string[]) =>
    getGroupItems<ForSaleAttributeKey>(attributes, groupKeys);

  const conditionItems = getForSaleGroupItems(FOR_SALE_GROUPS.condition);
  const optionsItems = getForSaleGroupItems(FOR_SALE_GROUPS.options);
  const languageItems = getForSaleGroupItems(FOR_SALE_GROUPS.language);

  const hasAny = conditionItems.length > 0 || optionsItems.length > 0 || languageItems.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        {conditionItems.length > 0 && (
          <AttributeSection label={FOR_SALE_GROUP_LABELS.condition}>
            <div className="flex flex-wrap gap-2">
              {conditionItems.map(({ key, value }) => {
                const formatted = formatForSaleAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {optionsItems.length > 0 && (
          <AttributeSection label={FOR_SALE_GROUP_LABELS.options}>
            <div className="flex flex-wrap gap-2">
              {optionsItems.map(({ key }) => {
                const label = FOR_SALE_BOOLEAN_DISPLAY_LABELS[key as keyof typeof FOR_SALE_BOOLEAN_DISPLAY_LABELS] ?? getForSaleAttributeLabel(key);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{label}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {languageItems.length > 0 && (
          <AttributeSection label={FOR_SALE_GROUP_LABELS.language}>
            <div className="flex flex-wrap gap-2">
              {languageItems.map(({ key, value }) => {
                const formatted = formatForSaleAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}
      </div>
    </div>
  );
}

function JobsAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const getJobsGroupItems = (groupKeys: readonly string[]) =>
    getGroupItems<JobsAttributeKey>(attributes, groupKeys);

  const employmentTypeItems = getJobsGroupItems(JOBS_GROUPS.employment_type);
  const optionsItems = getJobsGroupItems(JOBS_GROUPS.options);

  const hasAny = employmentTypeItems.length > 0 || optionsItems.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        {employmentTypeItems.length > 0 && (
          <AttributeSection label={JOBS_GROUP_LABELS.employment_type}>
            <div className="flex flex-wrap gap-2">
              {employmentTypeItems.map(({ key, value }) => {
                const formatted = formatJobsAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {optionsItems.length > 0 && (
          <AttributeSection label={JOBS_GROUP_LABELS.options}>
            <div className="flex flex-wrap gap-2">
              {optionsItems.map(({ key }) => {
                const label = JOBS_BOOLEAN_DISPLAY_LABELS[key as keyof typeof JOBS_BOOLEAN_DISPLAY_LABELS] ?? getJobsAttributeLabel(key);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{label}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}
      </div>
    </div>
  );
}

function CommunityAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const getCommunityGroupItems = (groupKeys: readonly string[]) =>
    getGroupItems<CommunityAttributeKey>(attributes, groupKeys);

  const lostOrFoundItems = getCommunityGroupItems(COMMUNITY_GROUPS.lost_or_found);
  const optionsItems = getCommunityGroupItems(COMMUNITY_GROUPS.options);

  const hasAny = lostOrFoundItems.length > 0 || optionsItems.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        {lostOrFoundItems.length > 0 && (
          <AttributeSection label={COMMUNITY_GROUP_LABELS.lost_or_found}>
            <div className="flex flex-wrap gap-2">
              {lostOrFoundItems.map(({ key, value }) => {
                const formatted = formatCommunityAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {optionsItems.length > 0 && (
          <AttributeSection label={COMMUNITY_GROUP_LABELS.options}>
            <div className="flex flex-wrap gap-2">
              {optionsItems.map(({ key, value }) => {
                const formatted = formatCommunityAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}
      </div>
    </div>
  );
}

function ServicesAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const optionsItems = getGroupItems<ServicesAttributeKey>(attributes, SERVICES_GROUPS.options);

  if (optionsItems.length === 0) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        <AttributeSection label={SERVICES_GROUP_LABELS.options}>
          <div className="flex flex-wrap gap-2">
            {optionsItems.map(({ key, value }) => {
              const formatted = formatServicesAttributeValue(key, value);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                >
                  <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                </span>
              );
            })}
          </div>
        </AttributeSection>
      </div>
    </div>
  );
}

function getGigsGroupItems(
  attributes: Record<string, string | number | boolean>,
  groupKeys: readonly string[]
): { key: GigsAttributeKey; value: string | number | boolean }[] {
  return groupKeys
    .map((key) => {
      const value = attributes[key];
      if (value === undefined) return null;
      if (value === false && key !== "paid") return null;
      return { key: key as GigsAttributeKey, value };
    })
    .filter((x): x is { key: GigsAttributeKey; value: string | number | boolean } => x !== null);
}

function ResumesAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const getResumesGroupItems = (groupKeys: readonly string[]) =>
    getGroupItems<ResumesAttributeKey>(attributes, groupKeys);

  const availabilityItems = getResumesGroupItems(RESUMES_GROUPS.availability);
  const educationItems = getResumesGroupItems(RESUMES_GROUPS.education);
  const optionsItems = getResumesGroupItems(RESUMES_GROUPS.options);

  const hasAny = availabilityItems.length > 0 || educationItems.length > 0 || optionsItems.length > 0;
  if (!hasAny) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        {availabilityItems.length > 0 && (
          <AttributeSection label={RESUMES_GROUP_LABELS.availability}>
            <div className="flex flex-wrap gap-2">
              {availabilityItems.map(({ key, value }) => {
                const formatted = formatResumesAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {educationItems.length > 0 && (
          <AttributeSection label={RESUMES_GROUP_LABELS.education}>
            <div className="flex flex-wrap gap-2">
              {educationItems.map(({ key, value }) => {
                const formatted = formatResumesAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}

        {optionsItems.length > 0 && (
          <AttributeSection label={RESUMES_GROUP_LABELS.options}>
            <div className="flex flex-wrap gap-2">
              {optionsItems.map(({ key, value }) => {
                const formatted = formatResumesAttributeValue(key, value);
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                  </span>
                );
              })}
            </div>
          </AttributeSection>
        )}
      </div>
    </div>
  );
}

function GigsAttributes({ attributes }: { attributes: Record<string, string | number | boolean> }) {
  const optionsItems = getGigsGroupItems(attributes, GIGS_GROUPS.options);

  if (optionsItems.length === 0) return null;

  return (
    <div className="mt-4 px-4">
      <span className="text-[11px] text-cl-text-muted">details</span>
      <div className="mt-2 space-y-4">
        <AttributeSection label={GIGS_GROUP_LABELS.options}>
          <div className="flex flex-wrap gap-2">
            {optionsItems.map(({ key, value }) => {
              const formatted = formatGigsAttributeValue(key, value);
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border bg-cl-surface px-3 py-2"
                >
                  <span className="text-[13px] font-medium text-cl-accent">{formatted}</span>
                </span>
              );
            })}
          </div>
        </AttributeSection>
      </div>
    </div>
  );
}

function AttributeSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-cl-text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}
