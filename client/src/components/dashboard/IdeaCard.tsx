import { Idea } from '../../types';
import { useNavigate } from 'react-router-dom';

const stageGradients = {
  IDEA: 'gradient-purple-blue',
  IN_DEVELOPMENT: 'gradient-orange-pink',
  LAUNCHED: 'gradient-green-blue',
  SIDELINED: 'bg-gradient-to-br from-gray-400 to-gray-500',
};

const stageLabels = {
  IDEA: 'Idea',
  IN_DEVELOPMENT: 'In Development',
  LAUNCHED: 'Launched',
  SIDELINED: 'Sidelined',
};

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard = ({ idea }: IdeaCardProps) => {
  const navigate = useNavigate();
  const tagArray = idea.tags ? idea.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  return (
    <div
      onClick={() => navigate(`/ideas/${idea.id}`)}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Gradient header */}
      <div className={`${stageGradients[idea.stageGate]} h-32 relative`}>
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="text-white/90 text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            #{idea.ideaNumber}
          </span>
          <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            {stageLabels[idea.stageGate]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {idea.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {idea.description}
        </p>

        {idea.opportunity && (
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
            <span className="text-base">💰</span>
            <span>{idea.opportunity}</span>
          </div>
        )}

        {tagArray.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tagArray.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {tagArray.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{tagArray.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(idea.createdAt).toLocaleDateString()}
          </span>
          {idea.collaborators.length > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {idea.collaborators.length + 1}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
