import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ideaService } from '../services/ideaService';
import { Idea, StageGate } from '../types';

const stageLabels = {
  IDEA: 'Idea',
  IN_DEVELOPMENT: 'In Development',
  LAUNCHED: 'Launched',
  SIDELINED: 'Sidelined',
};

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [opportunity, setOpportunity] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC' | 'GROUP'>('PRIVATE');
  const [allowedGroupId, setAllowedGroupId] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [stageGate, setStageGate] = useState<StageGate>('IDEA');

  useEffect(() => {
    if (id) {
      fetchIdea();
      fetchGroups();
    }
  }, [id]);

  const fetchGroups = async () => {
    try {
      const { groupService } = await import('../services/groupService');
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const fetchIdea = async () => {
    try {
      const data = await ideaService.getIdeaById(id!);
      setIdea(data);
      setTitle(data.title);
      setDescription(data.description);
      setOpportunity(data.opportunity || '');
      setTags(data.tags || '');
      setVisibility(data.visibility);
      setAllowedGroupId(data.allowedGroup?.id || '');
      setStageGate(data.stageGate);
    } catch (error) {
      console.error('Failed to fetch idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ideaService.updateIdea(id!, { 
        title, 
        description, 
        opportunity, 
        tags, 
        visibility,
        allowedGroupId: visibility === 'GROUP' ? allowedGroupId : undefined,
        stageGate 
      });
      setEditing(false);
      fetchIdea();
    } catch (error) {
      console.error('Failed to update idea:', error);
    }
  };

  const handleSideline = async () => {
    try {
      await ideaService.sidelineIdea(id!);
      fetchIdea();
    } catch (error) {
      console.error('Failed to sideline idea:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }
    try {
      await ideaService.deleteIdea(id!);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  const canEdit = idea && (
    idea.owner.id === user?.id ||
    idea.collaborators.some(c => c.id === user?.id) ||
    user?.role === 'ADMIN'
  );

  const canSideline = idea && (
    idea.owner.id === user?.id ||
    user?.role === 'ADMIN'
  );

  const tagArray = idea?.tags ? idea.tags.split(',').map(t => t.trim()).filter(t => t) : [];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!idea) {
    return <div className="flex items-center justify-center min-h-screen">Idea not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-700 mr-4"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">Idea #{idea.ideaNumber}</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {editing ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  $ Opportunity
                </label>
                <input
                  type="text"
                  value={opportunity}
                  onChange={(e) => setOpportunity(e.target.value)}
                  placeholder="e.g., $50,000 annual savings"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., travel, cost-saving, customer-experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Separate multiple tags with commas</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage Gate
                </label>
                <select
                  value={stageGate}
                  onChange={(e) => setStageGate(e.target.value as StageGate)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IDEA">Idea</option>
                  <option value="IN_DEVELOPMENT">In Development</option>
                  <option value="LAUNCHED">Launched</option>
                  <option value="SIDELINED">Sidelined</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'PRIVATE' | 'PUBLIC' | 'GROUP')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PRIVATE">Private (only you and collaborators)</option>
                  <option value="PUBLIC">Public (everyone can see)</option>
                  <option value="GROUP">Group (specific group only)</option>
                </select>
              </div>
              {visibility === 'GROUP' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Group
                  </label>
                  <select
                    value={allowedGroupId}
                    onChange={(e) => setAllowedGroupId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a group...</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{idea.title}</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {stageLabels[idea.stageGate]}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{idea.description}</p>
                {idea.opportunity && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                    <span className="text-sm font-medium text-green-800">💰 Opportunity: </span>
                    <span className="text-sm text-green-700">{idea.opportunity}</span>
                  </div>
                )}
                {tagArray.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tagArray.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <span className="text-sm font-medium text-gray-700">Privacy: </span>
                  <span className="text-sm text-gray-600">
                    {idea.visibility === 'PRIVATE' && '🔒 Private'}
                    {idea.visibility === 'PUBLIC' && '🌐 Public'}
                    {idea.visibility === 'GROUP' && `👥 Group: ${idea.allowedGroup?.name || 'Unknown'}`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Owner:</span>
                    <span className="ml-2 text-gray-900">{idea.owner.username || idea.owner.email}</span>
                  </div>
                </div>
              </div>

              {idea.collaborators.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Collaborators</h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.collaborators.map((collab) => (
                      <span
                        key={collab.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {collab.username || collab.email}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {canEdit && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
                {canSideline && (
                  <button
                    onClick={handleSideline}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    {idea.isSidelined ? 'Restore' : 'Sideline'}
                  </button>
                )}
                {canSideline && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
