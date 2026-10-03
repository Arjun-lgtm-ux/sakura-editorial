import SakuraEditorialPoster from "@/components/ui/sakura-editorial-poster";

export default function DefaultDemo({
  onTabClick,
}: {
  onTabClick?: (tabId: string) => void;
} = {}) {
  return (
    <SakuraEditorialPoster
      className="w-full"
      onTabClick={onTabClick}
      sceneSrc={`${import.meta.env.BASE_URL}mine-background.jpg`}
      sceneAlt="Open-pit mining quarry aerial view"
      foregroundSrc={null}
      title="AD MARSAL"
      headline="The Protective Friend | AR Vocational Safety"
      subheadline="Smart India Hackathon 2026 · AI & AR Safety"
      body="Equipping frontline workers and trainees with real-time AR hazard detection, simulated emergency protocols, and hands-on vocational preparedness."
      footerLeft="Ad Marsal"
      footerCenter="SIH26041"
      footerRight="2026 Edition"
      socialHandle="@admarsal"
      keywords={[
        { label: "Protect" },
        { label: "Train" },
        { label: "Empower" },
      ]}
    />
  );
}
