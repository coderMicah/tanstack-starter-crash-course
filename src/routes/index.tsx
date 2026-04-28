import { createFileRoute, Link } from "@tanstack/react-router";
import { TerminalIcon } from "lucide-react";
import SkillCard from "#/components/skill-card";
import { dummySkills, skills } from "#/lib/dummy-skills";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div id="home">
			<section className="hero">
				<div className="copy">
					<h1>
						The Registry for <br />{" "}
						<span className="text-gradient">Agentic Intelligence</span>
					</h1>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea
						pariatur nemo est labore esse placeat tempore nihil, nesciunt
						repellat doloribus.
					</p>
				</div>

				<div className="actions">
					<Link to="/skills" className="btn-primary">
						<TerminalIcon size={18} />
						<span>Browse Registry</span>
					</Link>
					<Link to="/skills/new" className="btn-secondary">
						<TerminalIcon size={18} />
						<span>Publish Skills</span>
					</Link>
				</div>

				<div className="latest">
					<div className="space-y-2">
						<h2>
							Recently Created <span className="text-gradient">Skills</span>
						</h2>
						<p>Latest skills loaded from database in descending order </p>
					</div>
				</div>

				<div>
					{dummySkills.length > 0 ? (
						<div className="skills-grid">
							{dummySkills.map((skill) => (
								<SkillCard key={skill.id} {...skill} />
							))}
						</div>
					) : (
						<p>No skills have been created yet.</p>
					)}
				</div>
			</section>
		</div>
	);
}
