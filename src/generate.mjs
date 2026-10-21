// This port owns its application mappings. Inputs come only from the pinned local palette.


const json = {
files: () => [],
all: (fs) => {
    const data = Object.fromEntries(fs.map((f) => [f.id, {
      name: f.name,
      light: f.light,
      colors: Object.fromEntries(Object.entries(f.colors).map(([n, c]) => [n, { hex: c.hex, oklch: c.css, rgb: c.rgb }])),
      roles: f.roles,
      ansi: f.ansi,
    }]));
    const body = JSON.stringify(data, null, 2);
    return [
      { path: "palette.json", content: body + "\n" },
      { path: "palette.mjs", content: `export const palette = ${body};\nexport default palette;\n` },
    ];
  }
};

export function generate(flavors) {
  return [...flavors.flatMap(f => json.files(f)), ...(json.all?.(flavors) ?? [])].filter(f => !["LICENSE", "README.md", "package.json", "extension.toml"].includes(f.path.split("/").at(-1)));
}
