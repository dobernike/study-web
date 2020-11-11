import { useState } from 'react';

import ResourceSearch from '../components/ResourceSearch';
import ResourceList from '../components/ResourceList';
import ResourceDetail from '../components/ResourceDetail';
import ResourceUpdate from '../components/ResourceUpdate';
import Header from '../components/Header';

const initialResources = [
  {
    _id: '1',
    title: 'resource 1',
    description: 'Description 1',
    link: 'https://google.com',
    type: 'blog',
  },
  {
    _id: '2',
    title: 'resource 2',
    description: 'Description 2',
    link: 'https://google.com',
    type: 'video',
  },
  {
    _id: '3',
    title: 'resource 3',
    description: 'Description 3',
    link: 'https://google.com',
    type: 'book',
  },
];

const ResourceHome = () => {
  const [resources, setResources] = useState(initialResources);

  const addResource = () => {
    const _id = '_' + Math.random().toString(36).substr(2, 9);
    const newSource = {
      _id,
      title: `Title ${_id}`,
      description: `Description ${_id}`,
      link: 'https://google.com',
      type: 'video',
    };

    setResources([newSource, ...resources]);
  };

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
          <ResourceList resources={resources} />
          <button onClick={addResource} className="btn btn-primary">
            Add Resource
          </button>
        </div>
        {/* <div className="col-md-8 order-md-1">
          <ResourceUpdate />
        </div> */}
        <div className="col-md-8 order-md-1">
          <ResourceDetail />
        </div>
      </div>
    </div>
  );
};

export default ResourceHome;
