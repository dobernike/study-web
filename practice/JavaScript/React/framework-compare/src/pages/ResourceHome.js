import { useState, useEffect } from 'react';

import ResourceSearch from '../components/ResourceSearch';
import ResourceList from '../components/ResourceList';
import ResourceDetail from '../components/ResourceDetail';
import ResourceUpdate from '../components/ResourceUpdate';
import Header from '../components/Header';

import { getResources } from '../actions';

const ResourceHome = () => {
  const [selectedResource, setSelectedResource] = useState();
  const [resources, setResources] = useState([]);
  const [isDetailView, setDetailView] = useState(true);

  useEffect(() => {
    async function _getResources() {
      const _resources = await getResources();
      setResources(_resources);
    }

    _getResources();
  }, []);

  const findResourceIndex = (resource) => {
    return resources.findIndex((r) => r._id === resource.id);
  };

  const updateResourceList = (resource) => {
    const resourceIndex = findResourceIndex(resource);
    const copy = [...resources];
    copy[resourceIndex] = resource;
    return copy;
  };

  const handleResourceUpdate = (updatedResource) => {
    const updatedResources = updateResourceList(updatedResource);

    setResources(updatedResources);
    setSelectedResource(updatedResource);
  };

  const hasResources = resources && resources.length > 0;
  const activeResource =
    selectedResource || (hasResources && resources[0]) || null;

  return (
    <div className="container">
      <Header />
      <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Your Resources</span>
            <span className="badge badge-secondary badge-pill">6</span>
          </h4>
          <ResourceSearch />
          <ResourceList
            activeId={activeResource?._id}
            onItemClick={setSelectedResource}
            resources={resources}
          />
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">
            Resource {activeResource?._id}
            <button
              onClick={() => setDetailView(!isDetailView)}
              className={`btn btn-sm ml-2 ${
                isDetailView ? 'btn-warning' : 'btn-primary'
              }`}
            >
              {isDetailView ? 'Edit' : 'Detail'}
            </button>
          </h4>
          {isDetailView ? (
            <ResourceDetail resource={activeResource} />
          ) : (
            <ResourceUpdate
              resource={activeResource}
              onResourceUpdate={handleResourceUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceHome;
