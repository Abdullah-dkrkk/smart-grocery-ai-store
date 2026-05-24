import { DesignHeroV3 } from "../_components/design-hero-v3"
import { ColorSection } from "../_components/color-section"
import { TypographySection } from "../_components/typography-section"
import { SpacingSection } from "../_components/spacing-section"
import { ShadowSection } from "../_components/shadow-section"
import { RadiusSection } from "../_components/radius-section"
import { ComponentShowcase } from "../_components/component-showcase"

export default function PreviewPage() {
  return (
    <div className="flex flex-col">
      <DesignHeroV3 />
      <ColorSection />
      <TypographySection />
      <SpacingSection />
      <ShadowSection />
      <RadiusSection />
      <ComponentShowcase />
    </div>
  )
}
