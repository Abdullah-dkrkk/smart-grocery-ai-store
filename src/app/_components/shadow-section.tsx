const shadowLevels = [
  { name: "2xs", token: "shadow-2xs", value: "0 1px 2px 0 rgb(0 0 0 / 0.04)", class: "shadow-2xs" },
  { name: "xs", token: "shadow-xs", value: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)", class: "shadow-xs" },
  { name: "sm", token: "shadow-sm", value: "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)", class: "shadow-sm" },
  { name: "md", token: "shadow", value: "0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)", class: "shadow" },
  { name: "lg", token: "shadow-md", value: "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)", class: "shadow-md" },
  { name: "xl", token: "shadow-lg", value: "0 25px 50px -12px rgb(0 0 0 / 0.12)", class: "shadow-lg" },
  { name: "2xl", token: "shadow-xl", value: "0 50px 100px -12px rgb(0 0 0 / 0.15)", class: "shadow-xl" },
]

export function ShadowSection() {
  return (
    <section className="py-section border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight mb-4">
            Shadows
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            Seven levels of shadow depth for elevation and layering.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shadowLevels.map((shadow) => (
            <div
              key={shadow.token}
              className={`rounded-xl bg-card p-6 ${shadow.class}`}
            >
              <div className="h-24 rounded-lg bg-background mb-4 flex items-center justify-center border">
                <div className={`h-12 w-24 rounded-md bg-card ${shadow.class}`} />
              </div>
              <p className="text-sm font-medium">{shadow.name}</p>
              <p className="text-xs font-mono text-muted-foreground">{shadow.token}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
