import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            {data.settings.projectsHeading}
          </h2>
          <div className="w-20 h-1 bg-gradient-premium rounded-full mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX,
        rotateY
      }}
      className="glassmorphism rounded-3xl overflow-hidden group cursor-pointer border-white/5 hover:border-white/20 transition-all duration-300 ease-out flex flex-col justify-between"
    >
      <div>
        <div 
          className={`w-full h-48 bg-gradient-to-br ${project.color || 'from-blue-600 to-cyan-500'} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center relative overflow-hidden`}
          style={{ transform: "translateZ(30px)" }}
        >
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <h3 className="text-3xl font-heading font-bold text-white/50 group-hover:scale-110 transition-transform duration-500">
                {project.title.charAt(0)}
              </h3>
            </>
          )}
        </div>
        
        <div className="p-8 relative" style={{ transform: "translateZ(20px)" }}>
          <h3 className="text-2xl font-bold text-white mb-3 font-heading group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed min-h-[4rem]">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag: string) => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-white/80 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-8 pt-0 relative" style={{ transform: "translateZ(20px)" }}>
        <div className="flex gap-4 border-t border-white/10 pt-6">
          <a
            href={project.codeUrl && project.codeUrl !== '#' ? project.codeUrl : '#'}
            target={project.codeUrl && project.codeUrl !== '#' ? '_blank' : undefined}
            rel={project.codeUrl && project.codeUrl !== '#' ? 'noreferrer' : undefined}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm font-medium"
            onClick={(e) => {
              if (!project.codeUrl || project.codeUrl === '#') e.preventDefault();
            }}
          >
            <Github className="w-4 h-4" /> Code
          </a>
          <a
            href={project.liveUrl && project.liveUrl !== '#' ? project.liveUrl : '#'}
            target={project.liveUrl && project.liveUrl !== '#' ? '_blank' : undefined}
            rel={project.liveUrl && project.liveUrl !== '#' ? 'noreferrer' : undefined}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors text-sm font-medium"
            onClick={(e) => {
              if (!project.liveUrl || project.liveUrl === '#') e.preventDefault();
            }}
          >
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
};
