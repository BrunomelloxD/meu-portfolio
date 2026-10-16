import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join } from "path";
import { projects, experiences, skillCategories, testimonials } from "../content";

const publicPath = (src: string) => join(process.cwd(), "public", src);

describe("content", () => {
  it("lists the three portfolio projects in order (PROJ-01)", () => {
    expect(projects.map((p) => p.title)).toEqual(["TypeRacer", "Speed Test", "API Ceps BR"]);
  });

  it("gives every project an image that exists in public/images/projects (PROJ-01)", () => {
    for (const project of projects) {
      expect(project.image).toMatch(/^\/images\/projects\//);
      expect(existsSync(publicPath(project.image))).toBe(true);
    }
  });

  it("labels repositories as Frontend/API and leaves API Ceps BR without repos (PROJ-02)", () => {
    expect(projects[0].repos.map((r) => r.label)).toEqual(["Frontend", "API"]);
    expect(projects[2].repos).toEqual([]);
  });

  it("lists the four experiences with role and period from the CV, newest first (WORK-01)", () => {
    expect(experiences.map((e) => `${e.company} | ${e.role} | ${e.period}`)).toEqual([
      "Grupo UND | Engenheiro de Software Sênior | 05/2026 — Presente",
      "Gazin Tech | Desenvolvedor Júnior III | 10/2025 — 05/2026",
      "Gazin Tech | Desenvolvedor Júnior I | 05/2024 — 10/2025",
      "Alares Internet | Desenvolvedor Júnior | 04/2023 — 05/2024",
    ]);
  });

  it("describes each experience with the CV highlights", () => {
    expect(experiences.map((e) => e.highlights.length)).toEqual([4, 4, 3, 3]);
    expect(experiences[0].highlights[1]).toContain("até 90% de redução no tempo das consultas");
  });

  it("groups 28 skills into Frontend, Backend and Dados & DevOps (ABOUT-03)", () => {
    expect(skillCategories.map((c) => c.label)).toEqual(["Frontend", "Backend", "Dados & DevOps"]);
    expect(skillCategories.flatMap((c) => c.skills)).toHaveLength(28);
  });

  it("keeps the three testimonials with an existing avatar (TEST-01)", () => {
    expect(testimonials.map((t) => t.name)).toEqual(["Lucas Lopes de Souza Guilha", "Thiago André", "Felipe Sasaki"]);
    for (const t of testimonials) {
      expect(existsSync(publicPath(t.avatar))).toBe(true);
    }
  });
});
