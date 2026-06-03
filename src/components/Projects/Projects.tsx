import "./Projects.css";

type Project = {
  name: string;
  url?: string;
  summary: string;
  highlights: string[];
  tech: string[];
};

type ProjectsProps = {
  projects: Project[];
  title: string;
};

const ProjectCard = ({ name, url, summary, highlights, tech }: Project) => (
  <article className="project">
    <h3 className="h3-end-with-line">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer">
          {name}
        </a>
      ) : (
        name
      )}
    </h3>
    <p>{summary}</p>
    <ul className="list-with-dot">
      {highlights.map((highlight, i) => (
        <li key={i}>{highlight}</li>
      ))}
    </ul>
    <p className="project-tech">{tech.sort().join(", ")}</p>
  </article>
);

export default ({ projects, title }: ProjectsProps) => (
  <section className="projects">
    <h2>{title}</h2>
    <div>
      {projects.map((project, i) => (
        <ProjectCard {...project} key={i} />
      ))}
    </div>
  </section>
);
